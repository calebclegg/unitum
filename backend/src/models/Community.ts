import { Schema, model } from "mongoose";
import { ICommunity } from "../types/community";
import { postSchema } from "../models/Post";

const communitySchema = new Schema<ICommunity>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    members: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: "User"
    },
    posts: {
      type: [postSchema]
    }
  },
  { timestamps: true }
);

const CommunityModel = model<ICommunity>("Community", communitySchema);

export default CommunityModel;
