import { Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Chat";
import {
  validateMessageData,
  validateNewChat
} from "../validators/message.validator";
import { Types } from "mongoose";
import { IMessage } from "../types/message";
import { IChat } from "../types/chat";
import { Document } from "mongoose";

export const getUnreadMessages = async (req: any, res: Response) => {
  const user = req.user;
  const chatID = req.query.chatID;
  let messages;
  if (chatID) {
    messages = await Message.find({
      to: user._id,
      chatID: chatID,
      read: false
    })
      .select("-__v")
      .populate({
        path: "from",
        select:
          "-fullName -role -__v -profile.communities -profile.schoolWork -profile.education -profile.unicoyn"
      });
  } else {
    messages = await Message.find({
      to: user._id,
      read: false
    })
      .select("-__v")
      .populate({
        path: "from",
        select:
          "-fullName -role -__v -profile.communities -profile.schoolWork -profile.education -profile.unicoyn"
      });
  }
  return res.status(200).json(messages);
};

export const markAsRead = async (req: any, res: Response) => {
  const user = req.user;
  const messageIDs = req.body.msgIDs;
  if (Array.isArray(messageIDs)) {
    await Message.updateMany(
      { _id: { $in: messageIDs }, to: user._id, read: false },
      { read: true }
    );
  } else {
    await Message.findOneAndUpdate(
      { _id: messageIDs, read: false, to: user._id },
      { read: true }
    );
  }
  return res.sendStatus(200);
};

export const getChatMessages = async (req: any, res: Response) => {
  const limit = +req.query.limit || 30;
  const skip = +req.query.skip || 0;
  const chatID = req.params.chatID;
  const user = req.user;

  const chat = await Chat.findOne({
    _id: chatID,
    participant: { $in: [user._id] }
  });
  if (!chat)
    return res
      .status(401)
      .json({ message: "You are not a participant of this chat" });
  const messages = await Message.find({ chatID: chatID })
    .sort({ updatedAt: 1 })
    .skip(skip)
    .limit(limit);

  const messageList = [];
  for (const message of messages) {
    let messageObj: any = {};
    if (message.from.toString() === user._id.toString()) {
      messageObj = { ...message.toObject(), from: "me" };
    } else {
      messageObj = { ...message.toObject(), from: "recipient" };
    }
    delete messageObj.to;
    messageList.push(messageObj);
  }
  return res.json(messageList.reverse());
};

export const getChats = async (req: any, res: Response) => {
  const user = req.user;

  const chats = await Chat.find(
    {
      participant: { $in: [user._id] }
    },
    { messages: { $slice: -1 } }
  )
    .populate([
      { path: "participant", select: "profile.fullName profile.picture" },
      { path: "messages", select: "-updatedAt -__v", limit: 1 }
    ])
    .sort({ updatedAt: -1 });

  const chatList: any = [];
  for (const chat of chats) {
    const recipient = chat.participant.filter((userObj) => {
      return userObj._id.toString() !== user._id.toString();
    })[0];
    let lastMessage = {};
    if (chat.messages) {
      let message: any = chat.messages[0];
      if (message.from.toString() === user._id.toString()) {
        message = { ...message.toObject(), from: "me" };
      } else {
        message = { ...message.toObject(), from: "recipient" };
      }
      delete message.to;
      lastMessage = message;
    }
    const unreadMessagesCount = await Message.find({
      to: user._id,
      chatID: chat._id,
      read: false
    }).count();
    const chatObj = {
      chatID: chat._id?.toString(),
      recipient: recipient,
      createdAt: chat.createdAt,
      lastMessage: lastMessage,
      numberOfUnreadMessages: unreadMessagesCount
    };
    chatList.push(chatObj);
  }
  return res.json(chatList);
};

export const sendMessage = async (req: any, res: Response) => {
  const user = req.user;
  const chatID = req.params.chatID;
  const chat = await Chat.findOne({
    _id: chatID,
    participant: { $in: [user._id] }
  });
  if (!chat)
    return res
      .status(401)
      .json({ message: "You are not a participant in this chat" });

  const recipient = chat.participant.filter((userID: Types.ObjectId) => {
    return userID._id.toString() !== user._id.toString();
  })[0];
  const valData = await validateMessageData(req.body);
  let errors;
  if (valData.error) {
    errors = valData.error.details.map((error) => ({
      label: error.context?.label,
      message: error.message
    }));
    return res.status(400).json(errors);
  }
  const newMessage = await new Message({
    ...valData.value,
    chatID: chatID,
    from: user._id,
    to: recipient
  }).save();

  chat.messages?.push(newMessage._id);
  await chat.save();

  let messageObj: any = {};
  if (newMessage.from.toString() === user._id.toString()) {
    messageObj = { ...newMessage.toObject(), from: "me" };
  } else {
    messageObj = { ...newMessage.toObject(), from: "recipient" };
  }
  delete messageObj.to;

  res.status(201).json(messageObj);
};

export const newChat = async (req: any, res: Response) => {
  const user = req.user;
  const { value, error } = await validateNewChat(req.body);
  let errors;
  if (error) {
    errors = error.details.map((err) => ({
      label: err.context?.label,
      message: err.message
    }));
    return res.status(400).json(errors);
  }
  let chat: (IChat & Document) | null;
  chat = await Chat.findOne({
    participant: { $all: [user._id, value.to] }
  });

  if (!chat) {
    chat = await new Chat({
      participant: [user.id, value.to]
    }).save();
  }
  const recipient = chat.participant.filter((userID: Types.ObjectId) => {
    return userID._id.toString() !== user._id.toString();
  })[0];

  const newMessage = await new Message({
    ...value,
    chatID: chat._id,
    from: user._id,
    to: recipient
  }).save();

  chat.messages?.push(newMessage._id);
  await chat.save();

  let messageObj: any = {};
  if (newMessage.from.toString() === user._id.toString()) {
    messageObj = { ...newMessage.toObject(), from: "me" };
  } else {
    messageObj = { ...newMessage.toObject(), from: "recipient" };
  }
  delete messageObj.to;
  let lastMessage = {};
  lastMessage = messageObj;
  const unreadMessagesCount = await Message.find({
    to: user._id,
    chatID: chat._id,
    read: false
  }).count();
  const chatObj = {
    chatID: chat._id?.toString(),
    recipient: recipient,
    createdAt: chat.createdAt,
    lastMessage: lastMessage,
    numberOfUnreadMessages: unreadMessagesCount
  };

  return res.status(201).json(chatObj);
};
