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
exports.chatHandler = void 0;
const mongoose_1 = require("mongoose");
const Chat_1 = require("../models/Chat");
const message_validator_1 = require("../validators/message.validator");
const chatHandler = (io, socket) => __awaiter(void 0, void 0, void 0, function* () {
    const sendMessage = (msg, callback) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof msg === "string")
            msg = JSON.parse(msg);
        msg.from = socket.user._id.toString();
        const valData = yield (0, message_validator_1.validateMessageData)(msg);
        let errors;
        if (valData.error) {
            errors = valData.error.details.map((error) => {
                var _a;
                return ({
                    label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                    message: error.message
                });
            });
            return callback({
                status: "400",
                message: "Bad Request",
                errors: errors
            });
        }
        try {
            const chat = yield Chat_1.Chat.findOne({
                _id: valData.value.chatID,
                participant: { $in: [socket.user._id] }
            });
            if (!chat)
                return callback({
                    status: "401",
                    message: "You are not a participant of this chat"
                });
            const newMessage = yield new Chat_1.Message(Object.assign({}, valData.value)).save();
            let messageObj = {};
            if (newMessage.from.toString() === socket.user._id.toString()) {
                messageObj = Object.assign(Object.assign({}, newMessage.toObject()), { from: "me" });
            }
            else {
                messageObj = Object.assign(Object.assign({}, newMessage.toObject()), { from: "recipient" });
            }
            delete messageObj.to;
            io.to(newMessage.chatID.toString()).emit("new message", messageObj);
        }
        catch (error) {
            callback({
                status: "500"
            });
        }
    });
    const getallChats = (callback) => __awaiter(void 0, void 0, void 0, function* () {
        const user = socket.user;
        try {
            const chats = yield Chat_1.Chat.find({
                participant: { $in: [new mongoose_1.Types.ObjectId(user._id)] }
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
                    select: "-__v -createdAt -updatedAt profile.fullName profile.picture -profile.dob -profile.education -email -fullName"
                }
            ]);
            chats.forEach((chat) => {
                socket.join(chat._id.toString());
            });
            io.to(user._id).emit("all chats", chats);
        }
        catch (error) {
            return callback({
                status: "500"
            });
        }
    });
    const joinChat = (chatID, callback) => __awaiter(void 0, void 0, void 0, function* () {
        let chat;
        if (!chatID)
            return callback({
                status: "400",
                message: "chatID parameter is required"
            });
        try {
            chat = yield Chat_1.Chat.findOne({ _id: chatID });
        }
        catch (error) {
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
    });
    const deleteChat = (chatID, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chat = yield Chat_1.Chat.findOne({ _id: chatID });
            if (!chat)
                return callback({
                    status: "404",
                    message: "Chat not found"
                });
            chat.delete();
        }
        catch (e) {
            return callback({
                status: "500"
            });
        }
    });
    const getChatMessages = (chatID, skip = 0, limit = 30, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const user = socket.user;
        if (!chatID)
            return callback({
                status: "400",
                message: "chatID parameter required"
            });
        skip = +skip;
        limit = +limit;
        try {
            const messages = yield Chat_1.Message.find({ chatID: chatID })
                .populate({
                path: "from",
                select: "profile.fullName profile.picture -profile.dob -profile.education -email -fullName"
            })
                .sort({ updatedAt: 1 })
                .skip(skip)
                .limit(limit);
            io.to(user._id.toString()).emit("chat messages", messages);
            return callback({
                status: "200"
            });
        }
        catch (error) {
            return callback({
                status: "500"
            });
        }
    });
    const deleteMessage = (messageID, callback) => __awaiter(void 0, void 0, void 0, function* () {
        if (!messageID)
            return callback({
                status: "400",
                message: "messageID parameter required"
            });
        let message;
        try {
            message = yield Chat_1.Message.findOne({ _id: messageID });
            if (!message)
                return callback({
                    status: "400",
                    message: "Message not found"
                });
            message.delete();
            return callback({
                status: "200"
            });
        }
        catch (error) {
            return callback({
                status: "500"
            });
        }
    });
    socket.on("message:send", sendMessage);
    socket.on("chat:delete", deleteChat);
    socket.on("chat:join", joinChat);
    socket.on("chat:read", getChatMessages);
    socket.on("chat:all", getallChats);
    socket.on("message:delete", deleteMessage);
});
exports.chatHandler = chatHandler;
