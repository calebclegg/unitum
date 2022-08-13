"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinCommunity = void 0;
const mongoose_1 = require("mongoose");
const joinRequest = new mongoose_1.Schema({
    community: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Community"
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
exports.JoinCommunity = (0, mongoose_1.model)("JoinCommunity", joinRequest);
