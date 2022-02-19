import { Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Chat";
import { IChat } from "../types/chat";
import { IMessage } from "../types/message";

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
  const messageIDs = req.query.msgIDs;
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
  return res.json(messageList);
};

export const getChats = async (req: any, res: Response) => {
  const user = req.user;

  const chats = await Chat.find(
    {
      participant: { $in: [user._id] }
    },
    { messages: { $slice: -1 } }
  ).populate([
    { path: "participant", select: "profile.fullName profile.picture" },
    { path: "messages", select: "-updatedAt -__v", limit: 1 }
  ]);

  const chatList: any = [];
  for (const chat of chats) {
    const reciepient = chat.participant.filter((userObj) => {
      return userObj._id.toString() === user._id.toString();
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
      reciepient: reciepient,
      createdAt: chat.createdAt,
      lastMessage: lastMessage,
      numberOfUnreadMessages: unreadMessagesCount
    };
    chatList.push(chatObj);
  }
  return res.json(chatList);
};
