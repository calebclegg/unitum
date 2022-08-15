"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const membersSchema = new mongoose_1.Schema({
    info: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    role: {
        type: String,
        enum: ["admin", "moderator", "member"],
        default: "member"
    }
});
const communitySchema = new mongoose_1.Schema({
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        max: 30,
        required: true
    },
    picture: {
        type: String
    },
    description: {
        type: String,
        max: 200
    },
    numberOfMembers: {
        type: Number,
        default: 0
    },
    numberOfPosts: {
        type: Number,
        default: 0
    },
    members: [membersSchema]
}, { timestamps: true });
communitySchema.index({ $name: "text" });
const CommunityModel = (0, mongoose_1.model)("Community", communitySchema);
exports.default = CommunityModel;
