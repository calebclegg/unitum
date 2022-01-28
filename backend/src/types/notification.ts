import { Types } from "mongoose";

export interface notification {
  userID?: Types.ObjectId;
  message: String;
  createdAt?: Date;
  user?: Types.ObjectId;
  type: "message" | "post" | "community";
  postID?: Types.ObjectId;
  communityID?: Types.ObjectId;
}
