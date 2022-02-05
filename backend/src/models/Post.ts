import { Schema, model } from "mongoose";
import { IPost, IComment } from "../types/post";

const commentSchema = new Schema<IComment>(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    postID: {
      type: Schema.Types.ObjectId,
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
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    communityID: {
      type: Schema.Types.ObjectId,
      ref: "Community"
    },
    body: {
      type: String,
      required: true
    },
    media: {
      type: [String]
    },
    numberOfComments: {
      type: Number,
      default: 0
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment"
    },
    upvotes: {
      type: Number,
      required: false,
      default: 0
    },
    downvotes: {
      type: Number,
      required: false,
      default: 0
    },
    upvoteBy: {
      type: [Schema.Types.ObjectId],
      ref: "User"
    },
    nextCoyn: {
      type: Number,
      default: 100,
      select: false
    },
    downVoteBy: {
      type: [Schema.Types.ObjectId],
      ref: "User"
    }
  },
  { timestamps: true }
);

export const PostModel = model<IPost>("Post", postSchema);
export const CommentModel = model<IComment>("Comment", commentSchema);
