import { Types } from "mongoose"

interface ICommunity {
    admin: Types.ObjectId,
    name: string,
    description?: string,
    numberOfMembers?: number,
    numberOfPosts?: number
    createdAt?: Date
}

export { ICommunity }