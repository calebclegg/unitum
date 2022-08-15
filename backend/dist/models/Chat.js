"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    chatID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chat"
    },
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String
    },
    media: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const chatSchema = new mongoose_1.Schema({
    participant: {
        type: [mongoose_1.Types.ObjectId],
        required: true,
        ref: "User",
        max: 2,
        min: 2
    },
    messages: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Message"
    }
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)("Chat", chatSchema);
exports.Message = (0, mongoose_1.model)("Message", messageSchema);
