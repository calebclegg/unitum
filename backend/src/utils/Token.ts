import { IUser } from "../types/user";
import jwt from "jsonwebtoken";
import { JwtPayload, VerifyOptions } from "jsonwebtoken";
import { redisConnect, redisClient } from "../config/redis_connect";

export const createToken = async (user: IUser) => {
  const secret = process.env.JWT_SECRET;
  const dataStoredInToken: JwtPayload = {
    sub: user.email,
    iss: process.env.JWT_ISSUER
  };
  const token = jwt.sign(dataStoredInToken, secret!, { expiresIn: "10m" });
  return token;
};

export const createRefreshToken = async (user: IUser) => {
  const secret = process.env.RF_TOKEN_SECRET;

  const dataStoredInToken: JwtPayload = {
    sub: user.email,
    iss: process.env.JWT_ISSUER
  };
  const token = jwt.sign(dataStoredInToken, secret!, { expiresIn: "7d" });
  return token;
};

export const decodeToken = async (jwtString: string, type: string) => {
  const tokenTypes: Record<string, Record<string, string>> = {
    access: {
      secret: process.env.JWT_SECRET || "",
      maxAge: process.env.JWT_EXPIRE_TIME || ""
    },
    refresh: {
      secret: process.env.RF_TOKEN_SECRET || "",
      maxAge: process.env.RF_EXPIRE_TIME || ""
    }
  };
  const options: VerifyOptions = {
    issuer: process.env.JWT_ISSUER
  };
  const payload = jwt.verify(jwtString, tokenTypes[type].secret, options);
  return payload;
};

export const saveRefreshToken = async (email: string, token: string) => {
  await redisConnect();
  await redisClient.execute(["SET", email, token]);
  await redisClient.execute(["expire", email, 691200]);
};

export const retrieveRefreshToken = async (email: string) => {
  await redisConnect();
  const token = await redisClient.execute(["GET", email]);
  return token;
};
export const deleteRefreshToken = async (email: string) => {
  await redisConnect();
  await redisClient.execute(["DEL", email]);
};
