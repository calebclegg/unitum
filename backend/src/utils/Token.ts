import { DataStoredInToken } from "../types/token";
import { IUSer } from "../types/user";
import jwt from "jsonwebtoken";
import { JwtPayload, VerifyOptions } from "jsonwebtoken";

export const createToken = async (user: IUSer) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE_TIME;
  const dataStoredInToken: JwtPayload = {
    sub: user.email,
    iss: process.env.JWT_ISSUER
  };
  const token = jwt.sign(dataStoredInToken, secret!, { expiresIn: "10m" });
  return token
};

export const createRefreshToken = async (user: IUSer) => {
  const secret = process.env.RF_TOKEN_SECRET;
  const expiresIn = process.env.RF_TOKEN_EX;
  
  const dataStoredInToken: JwtPayload = {
    sub: user.email,
    iss: process.env.JWT_ISSUER
  };
  const token = jwt.sign(dataStoredInToken, secret!, { expiresIn: expiresIn });
  return token
};

export const decodeToken = async (jwtString: string, type: string) => {
  const tokenTypes:Record<string,Record<string, string>> = {
    "access": {"secret": process.env.JWT_SECRET||"", "maxAge": process.env.JWT_EXPIRE_TIME || ""},
    "refresh": {"secret": process.env.RF_TOKEN_SECRET||"", "maxAge": process.env.RF_EXPIRE_TIME || ""}
  }
  const options: VerifyOptions = {
    issuer: process.env.JWT_ISSUER,
    maxAge: tokenTypes[type].maxAge || "15m"
  };
  const payload = jwt.verify(jwtString, tokenTypes[type].secret, options);
  return payload;
};


