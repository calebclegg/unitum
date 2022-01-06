import { Schema, model } from "mongoose";
import { IPost, IComment } from "../types/post";

const commentSchema = new Schema<IComment>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    postID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post"
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const postSchema = new Schema<IPost>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    communityID: {
      type: Schema.Types.ObjectId,
      ref: "Community"
    },
    text: {
      type: String,
      required: true
    },
    numberOfComments: {
      type: Number,
      default: 0
    },
    comments: {
      type: [commentSchema]
    },
    upvotes: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { timestamps: true }
);

const PostModel = model<IPost>("Post", postSchema);
const CommentModel = model<IComment>("Comment", commentSchema);

module.exports = { PostModel, CommentModel };
