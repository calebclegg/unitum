import { Types } from "mongoose"

export interface IComment {
  userID: Types.ObjectId;
  postID: Types.ObjectId;
  text: string;
  createdAt?: Date;
}
export interface IPost {
    userID: Types.ObjectId,
    communityID: Types.ObjectId,
    text: string,
    numberOfComments?: number
    comments?: [IComment]
    upvotes?: Number
}
