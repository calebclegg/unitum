import { Schema, model, Types } from "mongoose";
import { ICommunity } from "../types/community";
import { postSchema } from "../models/Post";

const membersSchema = new Schema({
  memberID: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: string,
    enum: ["admin", "moderator", "member"]
  }
});
const communitySchema = new Schema<ICommunity>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    name: {
      type: String,
      max: 30,
      required: true
    },
    description: {
      type: String,
      max: 200
    },
    numberOfMembers: {
      type: Number,
      default: 0
    },
    numberOfPosts: {
      type: Number,
      default: 0
    },
    members: [membersSchema]
  },
  { timestamps: true }
);

const CommunityModel = model<ICommunity>("Community", communitySchema);

export default CommunityModel;
