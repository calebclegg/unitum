import { Types } from "mongoose";
import { IPost } from "../types/post";

export interface ICommunity {
  admin: Types.ObjectId;
  members?: [Types.ObjectId];
  posts?: [IPost];
  createdAt: Date;
}
