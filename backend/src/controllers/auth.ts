/* eslint-disable @typescript-eslint/no-non-null-assertion */
import User from "../models/User";
import { Request, Response } from "express";
import {
  createRefreshToken,
  createToken,
  decodeToken,
  retrieveRefreshToken
} from "../utils/Token";
import { validateEmail } from "../validators/user.validator";
import { normalizeGoogleData } from "../utils/dataNormalizer";
import { saveRefreshToken, deleteRefreshToken } from "../utils/Token";
import { AnyKeys, AnyObject } from "mongoose";
import { IUser } from "../types/user";

export const register = async (req: Request, res: Response) => {
  const newUser = new User({
    ...req.body,
    authProvider: req.body.authProvider || "LOCAL",
    role: "active"
  });
  const savedUser = await newUser.save();
  const accessToken = await createToken(savedUser);
  const refreshToken = await createRefreshToken(savedUser);

  await saveRefreshToken(req.body.email, refreshToken);
  res.status(201).json({ accessToken, refreshToken });
};

export const login = async (req: any, res: Response) => {
  const user = req.user;
  const isVerified = await user.verifyPassword(req.body.password);
  if (!isVerified)
    return res.status(400).json({ message: "Password is incorrect" });

  const accessToken = await createToken(user);
  const refreshToken = await createRefreshToken(user);
  await saveRefreshToken(user.email, refreshToken);
  console.log(accessToken);
  return res.status(200).json({ accessToken, refreshToken });
};

export const checkAuthProvider = async (req: Request, res: Response) => {
  const valData = validateEmail(req.body);
  if (valData.error) {
    return res.status(400).json({
      message: "This field is invalid/required",
      errors: valData.error
    });
  }

  const dbUser = await User.findOne({ email: valData.value.email }).select(
    "+authProvider"
  );

  if (!dbUser)
    return res
      .status(404)
      .json({ message: "User with this email does not exist" });

  return res
    .status(200)
    .json({ authProvider: dbUser.authProvider, email: dbUser.email });
};

type authProvider = "GOOGLE" | "FACEBOOK" | "TWITTER" | string;
export const externalAuth = async (req: any, res: Response) => {
  const provider: authProvider = String(req.params.provider).toUpperCase();
  if (!provider) {
    return res.status(400).json({ message: "Authentication Provider not set" });
  }
  let userData: (AnyKeys<IUser> & AnyObject) | undefined;
  if (provider === "GOOGLE") {
    userData = await normalizeGoogleData(req.body);
  }

  const dbUser = await User.findOne({ email: userData?.email }).select(
    "+authProvider"
  );
  let accessToken, refreshToken;
  console.log(userData);
  if (!dbUser) {
    const newUser = new User({
      ...userData,
      "profile.picture": userData?.picture,
      "profile.fullName": userData?.fullName
    });

    console.log(newUser);
    const savedUser = await newUser.save();
    accessToken = await createToken(savedUser);
    refreshToken = await createRefreshToken(savedUser);

    await saveRefreshToken(savedUser.email!, refreshToken);

    return res.status(201).json({ accessToken, refreshToken });
  }
  if (dbUser.authProvider !== userData?.authProvider) {
    return res.status(409).json({
      message: "User with this email is associated with a different provider"
    });
  }

  accessToken = await createToken(dbUser);
  refreshToken = await createRefreshToken(dbUser);
  await saveRefreshToken(dbUser.email!, refreshToken);
  return res.status(200).json({ accessToken, refreshToken });
};

export const getNewAccessToken = async (req: any, res: Response) => {
  const refreshToken = req.headers.authorization.split(" ")[1];
  if (!refreshToken)
    return res.status(400).json({ message: "refresh Token required" });
  let tokenData;
  try {
    tokenData = await decodeToken(refreshToken, "refresh");
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }

  const redisToken = await retrieveRefreshToken(tokenData.sub!.toString());
  if (redisToken !== refreshToken) {
    return res.sendStatus(401);
  }

  const dbUser = await User.findOne({ email: tokenData.sub }).select([
    "+authProvider",
    "+password"
  ]);
  const accessToken = await createToken(dbUser!);
  const newRefreshToken = await createRefreshToken(dbUser!);
  await saveRefreshToken(tokenData.sub!.toString(), refreshToken);
  return res.status(200).json({ accessToken, newRefreshToken });
};

export const logout = async (req: any, res: Response) => {
  const user = req.user;
  await deleteRefreshToken(user.email);
  return res.sendStatus(200);
};
