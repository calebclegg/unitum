import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Chat";

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
    .populate({
      path: "from",
      select: "-profile.dob -profile.education -email -fullName"
    })
    .sort({ updatedAt: 1 })
    .skip(skip)
    .limit(limit);
  return res.json(messages);
};
