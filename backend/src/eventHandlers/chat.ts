import { Types } from "mongoose";
import { Server } from "socket.io";
import { Chat, Message } from "../models/Chat";
import { Notification } from "../models/Notification";
import { IMessage } from "../types/message";
import { notification } from "../types/notification";
import { validateMessageData } from "../validators/message.validator";

export const chatHandler = async (io: Server, socket: any) => {
  const sendMessage = async (message: IMessage) => {
    const valData = await validateMessageData(message);
    let errors;
    if (valData.error) {
      errors = valData.error.details.map((error) => ({
        label: error.context?.label,
        message: error.message
      }));
      console.log(errors);
    }
    if (!(valData?.value?.text && valData?.value?.text)) {
      console.log("message has neither text nor media..");
    }
    try {
      const message = await new Message(valData.value).save();
      socket.to(message.chatID).emit(
        "new message",
        message.populate({
          path: "from",
          select: "profile.fullname profile.picture"
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getallChats = async () => {
    const user = socket.user;
    try {
      const chats = await Chat.find({
        participant: { $in: [new Types.ObjectId(user._id)] }
      })
        .sort("updatedAt")
        .populate([
          {
            path: "messages",
            select: "-__v -createdAt",
            options: { limit: 1, sort: { updatedAt: 1 } }
          },
          {
            path: "participant",
            select:
              "-__v -createdAt -updatedAt profile.fullname profile.picture -profile.dob -profile.education -email -password -fullname -role - authProvider"
          }
        ]);
      socket.to(user._id).emit("all chats", chats);
    } catch (error) {
      console.log(error);
    }
  };

  const joinChat = async (chatID: string) => {
    let chat;
    try {
      chat = await Chat.findOne({ _id: chatID });
    } catch (error) {
      console.log(error);
    }
    if (!chat) return console.log(`Chat with id ${chatID} not found`);
    socket.join(chat._id);
  };

  const deleteChat = async (chatID: string) => {
    try {
      await Chat.findOneAndDelete({ _id: chatID });
    } catch (e) {
      console.log(e);
    }
  };

  const getChatMessages = async (chatID: string, skip = 0, limit = 30) => {
    const user = socket.user;
    const messages = await Message.find({ chatID: chatID })
      .populate({
        path: "from",
        select:
          "profile.fullname profile.picture -profile.dob -profile.education -email -fullname"
      })
      .sort({ updatedAt: 1 })
      .skip(skip)
      .limit(limit);
    socket.to(user._id.toString()).emit("chat messages", messages);
  };

  const deleteMessage = async (messageID: string) => {
    let message;
    try {
      message = await Message.findOne({ _id: messageID });
    } catch (error) {
      return console.log("Something went wrong");
    }
    if (!message) return console.log("Message not found");
    message.delete();
  };

  socket.on("message:send", sendMessage);
  socket.on("chat:delete", deleteChat);
  socket.on("chat:join", joinChat);
  socket.on("chat:read", getChatMessages);
  socket.on("message:delete", deleteMessage);
};
