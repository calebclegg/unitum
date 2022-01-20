import { Response, NextFunction } from "express";
import User from "../models/User";
import { decodeToken } from "../utils/Token";
import { JwtPayload } from "jsonwebtoken";

export const getUser = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null)
    return res.status(400).json({ message: "Authorization header not set" });

  let payload: JwtPayload | string;
  try {
    payload = await decodeToken(token!, "access");
  } catch (error) {
    return res.sendStatus(403);
  }
  if (!payload) return res.status(400).json({ message: "Invalid jwt token" });

  try {
    const user = await User.findOne({ email: payload.sub }).select([
      "-createdAt",
      "-updatedAt",
      "-role",
      "-__v",
      "+profile"
    ]);
    if (!user) return res.status(400).json({ message: "User does not exist" });
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};
