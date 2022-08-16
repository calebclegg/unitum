"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.PostModel = exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    postID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post"
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.postSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    communityID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Community"
    },
    body: {
        type: String,
        required: true
    },
    media: {
        type: [String]
    },
    numberOfComments: {
        type: Number,
        default: 0
    },
    comments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Comment"
    },
    upvotes: {
        type: Number,
        required: false,
        default: 0
    },
    downvotes: {
        type: Number,
        required: false,
        default: 0
    },
    upvoteBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User"
    },
    nextCoyn: {
        type: Number,
        default: 100,
        select: false
    },
    downVoteBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User"
    }
}, { timestamps: true });
exports.PostModel = (0, mongoose_1.model)("Post", exports.postSchema);
exports.CommentModel = (0, mongoose_1.model)("Comment", commentSchema);
