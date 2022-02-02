import { Schema, Types, model } from "mongoose";
import { ISavedPost } from "../types/savedPost";

const savedPostSchema = new Schema<ISavedPost>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    posts: {
      type: [Types.ObjectId],
      ref: "Post"
    }
  },
  { timestamps: true }
);

export const SavedPost = model("SavedPost", savedPostSchema);
