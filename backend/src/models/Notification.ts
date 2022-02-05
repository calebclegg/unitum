import { Schema, model, Types } from "mongoose";
import { notification } from "../types/notification";

const notificationSchema = new Schema<notification>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["post", "message", "like", "comment", "community"],
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community"
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  },
  { timestamps: true }
);

export const Notification = model<notification>(
  "Notification",
  notificationSchema
);
