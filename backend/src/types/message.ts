import { Types } from "mongoose";

export interface IMessage {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  chat: Types.ObjectId;
  to: Types.ObjectId;
  text?: string;
  media?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
