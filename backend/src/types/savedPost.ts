import { Types } from "mongoose";

export interface ISavedPost {
  _id: Types.ObjectId;
  userID: Types.ObjectId;
  posts: Types.ObjectId[];
}
