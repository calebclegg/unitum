import { Types } from "mongoose";

export interface IJoinCommunity {
  _id: Types.ObjectId;
  community: Types.ObjectId;
  user: Types.ObjectId;
}
