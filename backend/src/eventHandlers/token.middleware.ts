import { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import User from "../models/User";
import { decodeToken } from "../utils/Token";

export const getUser = async (socket: any, next: any) => {
  const token = socket.handshake.headers.authorization.split(" ")[1];
  if (token === null) next(new Error("Bad request"));

  let payload: JwtPayload | string = "";
  try {
    payload = await decodeToken(token!, "access");
  } catch (error) {
    next(new Error("Something went wrong"));
  }

  if (!payload) next(new Error("Token has expired"));

  try {
    const user = await User.findOne({ email: payload.sub })
      .select(["-createdAt", "-updatedAt", "-role", "-__v", "+profile"])
      .populate([
        { path: "profile.education", select: "-user -__v" },
        {
          path: "profile.communities",
          select: "-admin -members -__v -createdAt -updatedAt"
        }
      ]);
    if (!user) next(new Error("User does not exist"));
    socket.user = user;

    next();
  } catch (error) {
    return next(new Error("Something went wrong"));
  }
};
