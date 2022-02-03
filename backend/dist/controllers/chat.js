"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessages = exports.markAsRead = exports.getUnreadMessages = void 0;
const Chat_1 = require("../models/Chat");
const Chat_2 = require("../models/Chat");
const getUnreadMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const chatID = req.query.chatID;
    try {
        let messages;
        if (chatID) {
            messages = yield Chat_2.Message.find({
                to: user._id,
                chatID: chatID,
                read: false
            })
                .select("-__v")
                .populate({
                path: "from",
                select: "-fullName -role -__v -profile.communities -profile.schoolWork -profile.education -profile.unicoyn"
            });
        }
        else {
            messages = yield Chat_2.Message.find({
                to: user._id,
                read: false
            })
                .select("-__v")
                .populate({
                path: "from",
                select: "-fullName -role -__v -profile.communities -profile.schoolWork -profile.education -profile.unicoyn"
            });
        }
        return res.status(200).json(messages);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getUnreadMessages = getUnreadMessages;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const messageIDs = req.query.msgIDs;
    try {
        if (Array.isArray(messageIDs)) {
            yield Chat_2.Message.updateMany({ _id: { $in: messageIDs }, to: user._id, read: false }, { read: true });
        }
        else {
            yield Chat_2.Message.findOneAndUpdate({ _id: messageIDs, read: false, to: user._id }, { read: true });
        }
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.markAsRead = markAsRead;
const getChatMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = +req.query.limit || 30;
    const skip = +req.query.skip || 0;
    const chatID = req.params.chatID;
    const user = req.user;
    try {
        const chat = yield Chat_1.Chat.findOne({
            _id: chatID,
            participant: { $in: [user._id] }
        });
        if (!chat)
            return res
                .status(401)
                .json({ message: "You are not a participant of this chat" });
        const messages = yield Chat_2.Message.find({ chatID: chatID })
            .populate({
            path: "from",
            select: "-profile.dob -profile.education -email -fullName"
        })
            .sort({ updatedAt: 1 })
            .skip(skip)
            .limit(limit);
        return res.json(messages);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getChatMessages = getChatMessages;
