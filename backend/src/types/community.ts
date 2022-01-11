import { Types } from "mongoose";

interface IMembers {
  memberID: Types.ObjectId;
  role: "admin" | "moderator" | "member";
}
interface ICommunity {
  admin: Types.ObjectId;
  name: string;
  description?: string;
  numberOfMembers?: number;
  numberOfPosts?: number;
  members?: IMembers[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export { ICommunity };
