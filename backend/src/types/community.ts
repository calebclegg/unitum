import { Types } from "mongoose";

interface IMembers {
  info: Types.ObjectId;
  role: "admin" | "moderator" | "member";
}
interface ICommunity {
  admin: Types.ObjectId;
  name: string;
  picture: string;
  description?: string;
  numberOfMembers?: number;
  numberOfPosts?: number;
  members?: IMembers[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export { ICommunity };
