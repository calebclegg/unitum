import { Types } from "mongoose";

export interface schoolWork {
  _id?: Types.ObjectId;
  userID?: Types.ObjectId;
  title: string;
  description?: string;
  media?: string[];
  date?: Date;
  grade?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
