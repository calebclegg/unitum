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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Education = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const schoolSchema = new mongoose_1.Schema({
    name: String,
    url: String
});
const educationSchema = new mongoose_1.Schema({
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true
    // },
    school: {
        type: schoolSchema,
        required: true
    },
    degree: String,
    fieldOfStudy: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    grade: {
        type: Number
    }
});
const profileSchema = new mongoose_1.Schema({
    fullName: String,
    picture: String,
    dob: Date,
    education: {
        type: educationSchema
    },
    communities: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Community"
    },
    followers: {
        type: [mongoose_1.Types.ObjectId],
        ref: "User",
        default: []
    },
    followersCount: {
        type: Number,
        default: 0
    },
    following: {
        type: [mongoose_1.Types.ObjectId],
        ref: "User",
        default: []
    },
    followingCount: {
        type: Number,
        default: 0
    },
    schoolWork: {
        type: [mongoose_1.Types.ObjectId],
        ref: "SchoolWork"
    },
    unicoyn: {
        type: Number,
        default: 0
    }
});
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String
    },
    password: {
        type: String,
        select: false
    },
    email: {
        type: String,
        unique: true
    },
    picture: String,
    authProvider: {
        type: String,
        enum: ["LOCAL", "GOOGLE", "FACEBOOK", "TWITTER"],
        default: "LOCAL",
        required: false,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "active"],
        default: "active",
        required: false
    },
    profile: {
        type: profileSchema
    }
}, {
    timestamps: true
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            next();
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
        this.profile = { fullName: this.fullName, picture: this.picture };
    });
});
userSchema.methods.verifyPassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.Education = (0, mongoose_1.model)("Education", educationSchema);
exports.default = User;
