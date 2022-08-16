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
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsavePost = exports.saveAPost = exports.getSavedPosts = void 0;
const mongoose_1 = require("mongoose");
const Post_1 = require("../models/Post");
const SavedPost_1 = require("../models/SavedPost");
const getSavedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const db = yield SavedPost_1.SavedPost.findOne({ userID: user._id })
        .select("-userID +posts")
        .populate({
        path: "posts",
        select: "-__v +upvoteBy -comments",
        populate: [
            {
                path: "author",
                select: "profile.fullName profile.picture _id email"
            },
            {
                path: "communityID",
                select: "name picture"
            }
        ]
    });
    if (!db)
        return res.status(200).json([]);
    let posts = [...db.posts];
    posts = posts.map((post) => {
        var _a;
        const upvoted = (_a = post.upvoteBy) === null || _a === void 0 ? void 0 : _a.some((objectid) => {
            return objectid.equals(user._id);
        });
        delete post.upvoteBy;
        return Object.assign(Object.assign({}, post.toObject()), { upvoted: upvoted });
    });
    return res.status(200).json(posts);
});
exports.getSavedPosts = getSavedPosts;
const saveAPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { postID } = req.body;
    if (!postID)
        return res.status(400).json({ message: "postID is required" });
    const exists = yield Post_1.PostModel.exists({ _id: postID });
    if (!exists)
        return res.status(404).json({ message: "Post does not exist" });
    let savePosts = yield SavedPost_1.SavedPost.findOne({ userID: user._id });
    if (!savePosts) {
        savePosts = yield new SavedPost_1.SavedPost({
            userID: user._id,
            posts: [postID]
        }).save();
    }
    const saved = savePosts.posts.some((objectId) => {
        return objectId.equals(new mongoose_1.Types.ObjectId(postID));
    });
    if (saved) {
        const newPosts = savePosts.posts.filter((objectid) => {
            return objectid.toString() !== postID;
        });
        savePosts.posts = newPosts;
    }
    else {
        savePosts.posts.push(postID);
        console.log(savePosts);
    }
    yield savePosts.save();
    return res.sendStatus(200);
});
exports.saveAPost = saveAPost;
const unsavePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const postID = req.params.postID;
    const savedPost = yield SavedPost_1.SavedPost.findOne({ userID: user._id });
    if (!savedPost)
        return res.status(200).json([]);
    const posts = savedPost === null || savedPost === void 0 ? void 0 : savedPost.posts.filter((objectid) => {
        return objectid.toString() !== postID.toString();
    });
    if (savedPost === null || savedPost === void 0 ? void 0 : savedPost.posts)
        savedPost.posts = posts;
    yield (savedPost === null || savedPost === void 0 ? void 0 : savedPost.save());
    return res.sendStatus(200);
});
exports.unsavePost = unsavePost;
