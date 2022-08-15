"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.runSeeder = exports.destroyData = exports.importData = void 0;
const users_1 = __importDefault(require("./data/users"));
const community_1 = require("./data/community");
const posts_1 = require("./data/posts");
const User_1 = __importStar(require("./models/User"));
const Chat_1 = require("./models/Chat");
const chat_1 = require("./data/chat");
const Community_1 = __importDefault(require("./models/Community"));
const Post_1 = require("./models/Post");
const db_1 = __importDefault(require("./config/db"));
const dotenv_flow_1 = require("dotenv-flow");
const schoolWork_1 = require("./models/schoolWork");
(0, dotenv_flow_1.config)();
const db = (0, db_1.default)();
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        yield User_1.default.deleteMany();
        yield Community_1.default.deleteMany();
        yield Post_1.PostModel.deleteMany();
        yield Post_1.CommentModel.deleteMany();
        yield User_1.Education.deleteMany();
        yield schoolWork_1.SchoolWork.deleteMany();
        yield Chat_1.Chat.deleteMany();
        yield Chat_1.Message.deleteMany();
        const createdUsers = yield User_1.default.insertMany(users_1.default);
        let i = 0;
        const communitiesL = community_1.communities.map((community) => {
            const comm = Object.assign(Object.assign({}, community), { admin: createdUsers[i]._id, members: [
                    {
                        info: createdUsers[i]._id,
                        role: "admin"
                    }
                ], numberOfMembers: 1 });
            i++;
            return comm;
        });
        const savedCommunities = yield Community_1.default.insertMany(communitiesL);
        let l = 0;
        for (const community of savedCommunities) {
            const user = createdUsers[l];
            (_b = (_a = user.profile) === null || _a === void 0 ? void 0 : _a.communities) === null || _b === void 0 ? void 0 : _b.push(community._id);
            yield (user === null || user === void 0 ? void 0 : user.save());
            l++;
        }
        let k = 0;
        const postL = posts_1.posts.map((post) => {
            const pos = Object.assign(Object.assign({}, post), { author: createdUsers[k]._id });
            k++;
            return pos;
        });
        yield Post_1.PostModel.insertMany(postL);
        let j = 0;
        const chatL = chat_1.chats.map((chat) => {
            const chatObj = Object.assign(Object.assign({}, chat), { participant: [createdUsers[j]._id, createdUsers[j + 1]._id] });
            j++;
            return chatObj;
        });
        const savedChats = yield Chat_1.Chat.insertMany(chatL);
        const messageL = chat_1.messages.map((message) => {
            const messageObj = Object.assign(Object.assign({}, message), { from: savedChats[0].participant[0], to: savedChats[0].participant[1], chatID: savedChats[0]._id });
            return messageObj;
        });
        const savedMessages = yield Chat_1.Message.insertMany(messageL);
        const chat = savedChats[0];
        for (const message of savedMessages) {
            (_c = chat.messages) === null || _c === void 0 ? void 0 : _c.push(message._id);
        }
        yield chat.save();
        (yield db).connection.close();
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        (yield db).connection.close();
        process.exit(1);
    }
});
exports.importData = importData;
const destroyData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.deleteMany();
        yield Community_1.default.deleteMany();
        yield Post_1.PostModel.deleteMany();
        yield Post_1.CommentModel.deleteMany();
        yield User_1.Education.deleteMany();
        yield schoolWork_1.SchoolWork.deleteMany();
        (yield db).connection.close();
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        (yield db).connection.close();
        process.exit(1);
    }
});
exports.destroyData = destroyData;
const runSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === "development") {
        yield (0, exports.importData)();
    }
});
exports.runSeeder = runSeeder;
if (process.argv[2] === "-d") {
    (0, exports.destroyData)();
}
else {
    (0, exports.importData)();
}
