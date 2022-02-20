import { Schema, model } from "mongoose";
import { ICommunity } from "../types/community";

const membersSchema = new Schema({
  info: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "member"],
    default: "member"
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
    picture: {
      type: String
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

communitySchema.index({ $name: "text" });
const CommunityModel = model<ICommunity>("Community", communitySchema);

export default CommunityModel;
