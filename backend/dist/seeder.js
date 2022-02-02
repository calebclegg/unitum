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
exports.runSeeder = exports.destroyData = exports.importData = void 0;
const users_1 = __importDefault(require("./data/users"));
const community_1 = require("./data/community");
const posts_1 = require("./data/posts");
const User_1 = __importDefault(require("./models/User"));
const Community_1 = __importDefault(require("./models/Community"));
const Post_1 = require("./models/Post");
const db_1 = __importDefault(require("./config/db"));
const dotenv_flow_1 = require("dotenv-flow");
(0, dotenv_flow_1.config)();
const db = (0, db_1.default)();
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.deleteMany();
        yield Community_1.default.deleteMany();
        yield Post_1.PostModel.deleteMany();
        // const educations = await Education.insertMany(education);
        // users.forEach((user) => {
        //   return (user.profile.education = [educations[0]._id]);
        // });
        const createdUsers = yield User_1.default.insertMany(users_1.default);
        let i = 0;
        const communitiesL = community_1.communities.map((community) => {
            const comm = Object.assign(Object.assign({}, community), { admin: createdUsers[i]._id });
            i++;
            return comm;
        });
        const savedCommunities = yield Community_1.default.insertMany(communitiesL);
        const postL = posts_1.posts.map((post) => {
            let i = 0;
            const pos = Object.assign(Object.assign({}, post), { author: createdUsers[i]._id });
            i++;
            return pos;
        });
        const savedPosts = yield Post_1.PostModel.insertMany(postL);
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
