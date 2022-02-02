import { Types } from "mongoose";

export interface IContact {
  _id: Types.ObjectId;
  email: string;
  name: string;
  message: string;
}
