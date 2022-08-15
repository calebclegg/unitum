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
exports.newChat = exports.sendMessage = exports.getChats = exports.getChatMessages = exports.markAsRead = exports.getUnreadMessages = void 0;
const Chat_1 = require("../models/Chat");
const Chat_2 = require("../models/Chat");
const message_validator_1 = require("../validators/message.validator");
const getUnreadMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const chatID = req.query.chatID;
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
});
exports.getUnreadMessages = getUnreadMessages;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const messageIDs = req.body.msgIDs;
    if (Array.isArray(messageIDs)) {
        yield Chat_2.Message.updateMany({ _id: { $in: messageIDs }, to: user._id, read: false }, { read: true });
    }
    else {
        yield Chat_2.Message.findOneAndUpdate({ _id: messageIDs, read: false, to: user._id }, { read: true });
    }
    return res.sendStatus(200);
});
exports.markAsRead = markAsRead;
const getChatMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = +req.query.limit || 30;
    const skip = +req.query.skip || 0;
    const chatID = req.params.chatID;
    const user = req.user;
    const chat = yield Chat_1.Chat.findOne({
        _id: chatID,
        participant: { $in: [user._id] }
    });
    if (!chat)
        return res
            .status(401)
            .json({ message: "You are not a participant of this chat" });
    const messages = yield Chat_2.Message.find({ chatID: chatID })
        .sort({ updatedAt: 1 })
        .skip(skip)
        .limit(limit);
    const messageList = [];
    for (const message of messages) {
        let messageObj = {};
        if (message.from.toString() === user._id.toString()) {
            messageObj = Object.assign(Object.assign({}, message.toObject()), { from: "me" });
        }
        else {
            messageObj = Object.assign(Object.assign({}, message.toObject()), { from: "recipient" });
        }
        delete messageObj.to;
        messageList.push(messageObj);
    }
    return res.json(messageList.reverse());
});
exports.getChatMessages = getChatMessages;
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const chats = yield Chat_1.Chat.find({
        participant: { $in: [user._id] }
    }, { messages: { $slice: -1 } })
        .populate([
        { path: "participant", select: "profile.fullName profile.picture" },
        { path: "messages", select: "-updatedAt -__v", limit: 1 }
    ])
        .sort({ updatedAt: -1 });
    const chatList = [];
    for (const chat of chats) {
        const recipient = chat.participant.filter((userObj) => {
            return userObj._id.toString() !== user._id.toString();
        })[0];
        let lastMessage = {};
        if (chat.messages) {
            let message = chat.messages[0];
            if (message.from.toString() === user._id.toString()) {
                message = Object.assign(Object.assign({}, message.toObject()), { from: "me" });
            }
            else {
                message = Object.assign(Object.assign({}, message.toObject()), { from: "recipient" });
            }
            delete message.to;
            lastMessage = message;
        }
        const unreadMessagesCount = yield Chat_2.Message.find({
            to: user._id,
            chatID: chat._id,
            read: false
        }).count();
        const chatObj = {
            chatID: (_a = chat._id) === null || _a === void 0 ? void 0 : _a.toString(),
            recipient: recipient,
            createdAt: chat.createdAt,
            lastMessage: lastMessage,
            numberOfUnreadMessages: unreadMessagesCount
        };
        chatList.push(chatObj);
    }
    return res.json(chatList);
});
exports.getChats = getChats;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const user = req.user;
    const chatID = req.params.chatID;
    const chat = yield Chat_1.Chat.findOne({
        _id: chatID,
        participant: { $in: [user._id] }
    });
    if (!chat)
        return res
            .status(401)
            .json({ message: "You are not a participant in this chat" });
    const recipient = chat.participant.filter((userID) => {
        return userID._id.toString() !== user._id.toString();
    })[0];
    const valData = yield (0, message_validator_1.validateMessageData)(req.body);
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res.status(400).json(errors);
    }
    const newMessage = yield new Chat_2.Message(Object.assign(Object.assign({}, valData.value), { chatID: chatID, from: user._id, to: recipient })).save();
    (_b = chat.messages) === null || _b === void 0 ? void 0 : _b.push(newMessage._id);
    yield chat.save();
    let messageObj = {};
    if (newMessage.from.toString() === user._id.toString()) {
        messageObj = Object.assign(Object.assign({}, newMessage.toObject()), { from: "me" });
    }
    else {
        messageObj = Object.assign(Object.assign({}, newMessage.toObject()), { from: "recipient" });
    }
    delete messageObj.to;
    res.status(201).json(messageObj);
});
exports.sendMessage = sendMessage;
const newChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const user = req.user;
    const { value, error } = yield (0, message_validator_1.validateNewChat)(req.body);
    let errors;
    if (error) {
        errors = error.details.map((err) => {
            var _a;
            return ({
                label: (_a = err.context) === null || _a === void 0 ? void 0 : _a.label,
                message: err.message
            });
        });
        return res.status(400).json(errors);
    }
    let chat;
    chat = yield Chat_1.Chat.findOne({
        participant: { $all: [user._id, value.to] }
    });
    if (!chat) {
        chat = yield new Chat_1.Chat({
            participant: [user.id, value.to]
        }).save();
    }
    const recipient = chat.participant.filter((userID) => {
        return userID._id.toString() !== user._id.toString();
    })[0];
    const newMessage = yield new Chat_2.Message(Object.assign(Object.assign({}, value), { chatID: chat._id, from: user._id, to: recipient })).save();
    (_c = chat.messages) === null || _c === void 0 ? void 0 : _c.push(newMessage._id);
    yield chat.save();
    let messageObj = {};
    if (newMessage.from.toString() === user._id.toString()) {
        messageObj = Object.assign(Object.assign({}, newMessage.toObject()), { from: "me" });
    }
    else {
        messageObj = Object.assign(Object.assign({}, newMessage.toObject()), { from: "recipient" });
    }
    delete messageObj.to;
    let lastMessage = {};
    lastMessage = messageObj;
    const unreadMessagesCount = yield Chat_2.Message.find({
        to: user._id,
        chatID: chat._id,
        read: false
    }).count();
    const chatObj = {
        chatID: (_d = chat._id) === null || _d === void 0 ? void 0 : _d.toString(),
        recipient: recipient,
        createdAt: chat.createdAt,
        lastMessage: lastMessage,
        numberOfUnreadMessages: unreadMessagesCount
    };
    return res.status(201).json(chatObj);
});
exports.newChat = newChat;
