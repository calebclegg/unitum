import { Schema, model, Types } from "mongoose";
import { IChat } from "../types/chat";
import { IMessage } from "../types/message";

const messageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId
    },
    from: {
      type: Schema.Types.ObjectId
    },
    to: {
      type: Schema.Types.ObjectId
    },
    text: {
      type: String
    },
    media: {
      type: String
    }
  },
  { timestamps: true }
);

const chatSchema = new Schema<IChat>(
  {
    participant: {
      type: [Types.ObjectId],
      required: true,
      max: 2,
      min: 2
    },
    messages: {
      type: [Types.ObjectId],
      ref: "Message"
    }
  },
  { timestamps: true }
);

export const Chat = model("Chat", chatSchema);
export const Message = model("Message", messageSchema);
