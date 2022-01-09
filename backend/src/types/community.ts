import { Types } from "mongoose";

export interface ICommunity {
  admin: Types.ObjectId;
  name: string;
  description?: string;
  numberOfMembers?: number;
  numberOfPosts?: number;
  createdAt?: Date;
}
