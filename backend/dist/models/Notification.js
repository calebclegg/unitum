"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["post", "message", "like", "comment", "community"],
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    community: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Community"
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post"
    }
}, { timestamps: true });
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
