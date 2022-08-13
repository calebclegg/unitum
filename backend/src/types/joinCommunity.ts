import { Types } from "mongoose";
import { ICommunity } from "./community";
import { IUser } from "./user";

export interface IJoinCommunity {
  _id: Types.ObjectId;
  community: Types.ObjectId;
  user: Types.ObjectId;
}

export interface JoinRequest {
  _id: Types.ObjectId;
  community: ICommunity;
  user: IUser;
  delete: () => void;
}
