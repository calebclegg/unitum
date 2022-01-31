import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Chat";

export const getUnreadMessages = async (req: any, res: Response) => {
  const user = req.user;
  const chatID = req.query.chatID;
  try {
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
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const markAsRead = async (req: any, res: Response) => {
  const user = req.user;
  const messageIDs = req.query.msgIDs;
  try {
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
  } catch (error) {
    return res.sendStatus(500);
  }
};
