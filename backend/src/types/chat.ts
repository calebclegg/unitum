import { Types } from "mongoose";

export interface IChat {
  _id?: Types.ObjectId;
  participant: Types.ObjectId[];
  messages?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
