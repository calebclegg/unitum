import { DataStoredInToken, TokenData } from "../types/token";
import { IUSer } from "../types/user";
import jwt from "jsonwebtoken";
import { JwtPayload, VerifyOptions } from "jsonwebtoken";

export const createToken = async (user: IUSer) => {
  const secret = process.env.JWT_SECRET;
  console.log(typeof secret);
  const expiresIn = process.env.JWT_EXPIRE_TIME;
  const dataStoredInToken: JwtPayload = {
    sub: user.email,
    iss: process.env.JWT_ISSUER
  };
  const token = jwt.sign(dataStoredInToken, secret!, { expiresIn: "10m" });
  return {
    expiresIn: +expiresIn!,
    token: token
  };
};

export const decodeToken = async (jwtString: string) => {
  const options: VerifyOptions = {
    issuer: process.env.JWT_ISSUER,
    maxAge: "10m"
  };
  const payload = jwt.verify(jwtString, process.env.JWT_SECRET!, options);
  return payload;
};
