import { Types } from "mongoose";
import { Server } from "socket.io";
import { Chat, Message } from "../models/Chat";
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
      const chat = await Chat.findOne({
        _id: valData.value.chatID,
        participant: { $in: [socket.user._id] }
      });
      if (!chat)
        return callback({
          status: "401",
          message: "You are not a participant of this chat"
        });
      const newMessage = await new Message({ ...valData.value }).save();
      let messageObj: any = {};
      if (newMessage.from.toString() === socket.user._id.toString()) {
        messageObj = { ...newMessage.toObject(), from: "me" };
      } else {
        messageObj = { ...newMessage.toObject(), from: "recipient" };
      }
      delete messageObj.to;
      io.to(newMessage.chatID.toString()).emit("new message", messageObj);
    } catch (error) {
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
            options: { limit: 1, sort: { updatedAt: -1 } }
          },
          {
            path: "participant",
            select:
              "-__v -createdAt -updatedAt profile.fullName profile.picture -profile.dob -profile.education -email -fullName"
          }
        ]);
      chats.forEach((chat) => {
        socket.join(chat._id.toString());
      });
      io.to(user._id).emit("all chats", chats);
    } catch (error) {
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
      return callback({
        status: "500"
      });
    }
    if (!chat) {
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
            "profile.fullName profile.picture -profile.dob -profile.education -email -fullName"
        })
        .sort({ updatedAt: 1 })
        .skip(skip)
        .limit(limit);
      io.to(user._id.toString()).emit("chat messages", messages);
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
