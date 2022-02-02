"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolWork = void 0;
const mongoose_1 = require("mongoose");
const workSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 400,
        required: true
    },
    media: {
        type: [String],
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
}, { timestamps: true });
exports.SchoolWork = (0, mongoose_1.model)("SchoolWork", workSchema);
