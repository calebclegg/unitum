import { Types } from "mongoose"
import { IPost } from "../types/post"


interface ICommunity {
    admin: Types.ObjectId,
    members?: [Types.ObjectId],
    posts?: [IPost],
    createdAt: Date
}

export { ICommunity }