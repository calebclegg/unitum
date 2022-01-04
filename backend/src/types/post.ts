import { Types } from "mongoose"


interface IComment {
    userID: Types.ObjectId,
    postID: Types.ObjectId,
    text: string,
    createdAt?: Date
}
interface IPost {
    userID: Types.ObjectId,
    text: string,
    comments?: [IComment]
    upvotes?: Number
}


export { IPost, IComment }
