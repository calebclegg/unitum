import { Schema, model, Types } from "mongoose";
import { ICommunity } from "../types/community";
import { postSchema } from "../models/Post";

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
    }
  },
  { timestamps: true }
);

const CommunityModel = model<ICommunity>("Community", communitySchema);

export default CommunityModel;
