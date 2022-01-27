import { Types } from "mongoose";
import { Server } from "socket.io";
import { Chat, Message } from "../models/Chat";
import { IMessage } from "../types/message";
import { notification } from "../types/notification";
import { validateMessageData } from "../validators/message.validator";

export const chatHandler = async (io: Server, socket: any) => {
  const sendMessage = async (msg: any, callback: Function) => {
    if (typeof msg === "string") msg = JSON.parse(msg);
    msg.from = socket.user._id.toString();
    const valData = await validateMessageData(msg);
    let errors;
    if (valData.error) {
      errors = valData.error.details.map((error) => ({
        label: error.context?.label,
        message: error.message
      }));
      return callback({
        status: "400",
        message: "Bad Request",
        errors: errors
      });
    }
    try {
      const newMessage = await (
        await new Message({ ...valData.value }).save()
      ).populate({
        path: "from",
        select: "profile.fullname profile.picture"
      });

      socket.to(newMessage.chatID.toString()).emit("new message", newMessage);
    } catch (error) {
      console.log(error);
      callback({
        status: "500"
      });
    }
  };

  const getallChats = async (callback: Function) => {
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
              "-__v -createdAt -updatedAt profile.fullname profile.picture -profile.dob -profile.education -email -fullname"
          }
        ]);
      chats.forEach((chat) => {
        socket.join(chat._id.toString());
      });
      socket.to(user._id).emit("all chats", chats);
    } catch (error) {
      console.log(error);
      return callback({
        status: "500"
      });
    }
  };

  const joinChat = async (chatID: string, callback: Function) => {
    let chat;
    if (!chatID)
      return callback({
        status: "400",
        message: "chatID parameter is required"
      });
    try {
      chat = await Chat.findOne({ _id: chatID });
    } catch (error) {
      console.log(error);
      return callback({
        status: "500"
      });
    }
    if (!chat) {
      console.log(`Chat with id ${chatID} not found`);
      return callback({
        status: "404",
        message: "Chat not found"
      });
    }
    socket.join(chat._id);
    return callback({
      status: "200"
    });
  };

  const deleteChat = async (chatID: string, callback: Function) => {
    try {
      const chat = await Chat.findOne({ _id: chatID });
      if (!chat)
        return callback({
          status: "404",
          message: "Chat not found"
        });
      chat.delete();
    } catch (e) {
      console.log(e);
      return callback({
        status: "500"
      });
    }
  };

  const getChatMessages = async (
    chatID: string,
    skip = 0,
    limit = 30,
    callback: Function
  ) => {
    const user = socket.user;
    if (!chatID)
      return callback({
        status: "400",
        message: "chatID parameter required"
      });
    skip = +skip;
    limit = +limit;
    try {
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
      return callback({
        status: "200"
      });
    } catch (error) {
      return callback({
        status: "500"
      });
    }
  };

  const deleteMessage = async (messageID: string, callback: Function) => {
    if (!messageID)
      return callback({
        status: "400",
        message: "messageID parameter required"
      });
    let message;
    try {
      message = await Message.findOne({ _id: messageID });
      if (!message)
        return callback({
          status: "400",
          message: "Message not found"
        });
      message.delete();
      return callback({
        status: "200"
      });
    } catch (error) {
      return callback({
        status: "500"
      });
    }
  };

  socket.on("message:send", sendMessage);
  socket.on("chat:delete", deleteChat);
  socket.on("chat:join", joinChat);
  socket.on("chat:read", getChatMessages);
  socket.on("chat:all", getallChats);
  socket.on("message:delete", deleteMessage);
};
