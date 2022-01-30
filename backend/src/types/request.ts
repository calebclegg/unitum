import { IncomingHttpHeaders } from "http";
import { Request } from "express";
import { IUser } from "./user";
import { Document, Types } from "mongoose";

export interface IReq extends Request {
  user: Document<any, any, IUser> &
    IUser & {
      _id: Types.ObjectId;
    };
}
