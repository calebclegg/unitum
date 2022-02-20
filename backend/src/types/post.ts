import { Types } from "mongoose";

export interface IComment {
  author: Types.ObjectId;
  postID?: Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IPost {
  author: Types.ObjectId;
  communityID: Types.ObjectId;
  body: string;
  media: string[];
  numberOfComments?: number;
  comments?: Types.ObjectId[];
  upvotes?: number;
  downvotes?: number;
  upvoteBy?: Types.ObjectId[];
  downVoteBy?: Types.ObjectId[];
  nextCoyn?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
