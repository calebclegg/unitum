import User from "../models/User";
import { Request, Response } from "express";
import { createRefreshToken, createToken, decodeToken } from "../utils/Token";
import { validateEmail } from "../validators/user.validator";
import { normalizeGoogleData } from "../utils/dataNormalizer";

export const register = async (req: Request, res: Response) => {
  const newUser = new User({
    ...req.body,
    authProvider: req.body.authProvider || "LOCAL",
    role: "active"
  });
  try {
    const savedUser = await newUser.save();
    const accessToken = await createToken(savedUser);
    const refreshToken = await createRefreshToken(savedUser)
    res
      .status(201)
      .json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: any, res: Response) => {
  const user = req.user;
  const isVerified = await user.verifyPassword(req.body.password);
  if (!isVerified)
    return res.status(400).json({ message: "Password is incorrect" });

  const accessToken = await createToken(user);
  const refreshToken = await createRefreshToken(user);
  return res.status(200).json({accessToken, refreshToken});
};

export const checkAuthProvider = async (req: Request, res: Response) => {
  const valData = validateEmail(req.body);
  if (valData.error) {
    return res.status(400).json({
      message: "This field is invalid/required",
      errors: valData.error
    });
  }
  let dbUser;
  try {
    dbUser = await User.findOne({ email: valData.value.email }).select(
      "+authProvider"
    );
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
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
  const provider: authProvider = req.body.authProvider;
  if (!provider) {
    return res.status(400).json({ message: "Authentication Provider not set" });
  }
  let userData;
  if (provider === "GOOGLE") {
    userData = await normalizeGoogleData(req.body);
  }

  let dbUser;
  try {
    dbUser = await User.findOne({ email: userData?.email }).select(
      "+authProvider"
    );
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  let accessToken, refreshToken;
  if (!dbUser) {
    const newUser = new User({
      ...userData
    });
    try {
      const savedUser = await newUser.save();
     accessToken = await createToken(savedUser);
     refreshToken = await createRefreshToken(savedUser) 
      return res.status(201).json({accessToken, refreshToken});
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (dbUser.authProvider !== userData?.authProvider) {
    return res.status(409).json({
      message: "User with this email is associated with a different provider"
    });
  }

  accessToken = await createToken(dbUser);
  refreshToken = await createToken(dbUser);

  return res.status(200).json({accessToken, refreshToken});
};

export const getNewAccessToken = async (req: any, res: Response) => {
  const user = req.user
  const refreshToken = req.body.refreshToken 
  if(!refreshToken) return res.status(400).json({message: "refresh Token required"})
  let tokenData;
  try {
    tokenData = await decodeToken(refreshToken, "refresh")
  } catch (error) {
    return res.status(400).json({message: "Invalid Token"})
  }
  if (tokenData.sub !== user.email) return res.sendStatus(401)

  let dbUser;
  try {
    dbUser = await User.findOne({ email: tokenData.sub }).select(
      ["+authProvider", "+password"]
    );
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  const accessToken = await createToken(dbUser!)

  return res.status(200).json({accessToken})
}