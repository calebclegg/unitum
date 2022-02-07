import { model, Schema } from "mongoose";
import { IJoinCommunity } from "../types/joinCommunity";

const joinRequest = new Schema<IJoinCommunity>(
  {
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const JoinCommunity = model("JoinCommunity", joinRequest);
