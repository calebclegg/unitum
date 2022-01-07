import { Types } from "mongoose";

interface IComment {
    userID: Types.ObjectId,
    postID: Types.ObjectId,
    text: string,
    createdAt?: Date
}
interface IPost {
    userID: Types.ObjectId,
    communityID: Types.ObjectId,
    text: string,
    numberOfComments?: number
    comments?: [IComment]
    upvotes?: Number
}
