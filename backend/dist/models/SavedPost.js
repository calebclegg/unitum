"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPost = void 0;
const mongoose_1 = require("mongoose");
const savedPostSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    posts: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Post"
    }
}, { timestamps: true });
exports.SavedPost = (0, mongoose_1.model)("SavedPost", savedPostSchema);
