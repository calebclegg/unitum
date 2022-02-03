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
exports.deleteComment = exports.postDownVote = exports.postUpVote = exports.addPostComment = exports.getPostComments = exports.updatePost = exports.deletePost = exports.getPostDetails = exports.getPosts = exports.createPost = void 0;
const mongoose_1 = require("mongoose");
const Community_1 = __importDefault(require("../models/Community"));
const Post_1 = require("../models/Post");
const notification_1 = require("../utils/notification");
const post_validator_1 = require("../validators/post.validator");
// create a post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const valData = yield (0, post_validator_1.validatePostCreateData)(req.body);
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    let community;
    if (valData.value.communityID) {
        try {
            community = yield Community_1.default.findOne({
                _id: valData.value.communityID
            });
            if (!community)
                return res.status(404).json({ message: "Community not found" });
        }
        catch (e) {
            return res.sendStatus(500);
        }
    }
    try {
        const newPost = yield new Post_1.PostModel(Object.assign(Object.assign({}, valData.value), { author: user._id })).save();
        res.status(201).json(newPost);
        if (community) {
            const notificationInfo = {
                message: `${req.user.profile.fullName} added a new post in ${community.name}`,
                type: "community",
                user: user._id,
                post: newPost._id
            };
            yield (0, notification_1.sendNotification)(req.socket, notificationInfo, community._id.toString());
        }
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.createPost = createPost;
// get posts
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const communityID = req.query.communityID || null;
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 20;
    let dbPosts;
    try {
        if (communityID) {
            dbPosts = yield Post_1.PostModel.find({ communityID: communityID })
                .sort("createdAt")
                .select("-comments +upvoteBy")
                .populate([
                { path: "author", select: "profile.fullName" },
                { path: "communityID", select: "-__v -members" }
            ])
                .skip(skip)
                .limit(limit);
        }
        else {
            dbPosts = yield Post_1.PostModel.find({})
                .sort("createdAt")
                .select("-comments +upvoteBy")
                .populate([
                { path: "author", select: "profile.fullName" },
                { path: "communityID", select: "-__v -members" }
            ])
                .skip(skip)
                .limit(limit);
        }
        const posts = dbPosts.map((post) => {
            var _a;
            const upvoted = (_a = post.upvoteBy) === null || _a === void 0 ? void 0 : _a.some((objectid) => {
                return objectid.equals(req.user._id);
            });
            delete post.upvoteBy;
            return Object.assign(Object.assign({}, post.toObject()), { upvoted: upvoted });
        });
        return res.status(200).json(posts);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getPosts = getPosts;
// get post details
const getPostDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    try {
        let post = yield Post_1.PostModel.findOne({ _id: postID })
            .populate([
            {
                path: "author",
                select: "profile.fullName"
            },
            {
                path: "comments",
                select: "-__v",
                populate: {
                    path: "author",
                    select: "profile.fullName profile.picture"
                }
            },
            { path: "communityID", select: "-__v -members" }
        ])
            .select("upvoteBy");
        if (!post)
            return res.sendStatus(404);
        const upvoted = (_a = post.upvoteBy) === null || _a === void 0 ? void 0 : _a.some((objectid) => {
            return objectid.equals(req.user._id);
        });
        post = Object.assign(Object.assign({}, post.toObject()), { upvoted: upvoted });
        delete post.upvoteBy;
        return res.status(200).json(post);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getPostDetails = getPostDetails;
// delete a post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    let post;
    try {
        post = yield Post_1.PostModel.findOne({ _id: postID });
    }
    catch (error) {
        return res.sendStatus(500);
    }
    if (!post)
        return res.sendStatus(404);
    if ((post === null || post === void 0 ? void 0 : post.author.toString()) !== user._id.toString())
        return res.sendStatus(401);
    post === null || post === void 0 ? void 0 : post.delete();
    return res.sendStatus(200);
});
exports.deletePost = deletePost;
// update a post
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const valData = yield (0, post_validator_1.validatePostEditData)(req.body);
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    try {
        const post = yield Post_1.PostModel.findOne({ _id: postID });
        if (!post)
            return res.sendStatus(404);
        if ((post === null || post === void 0 ? void 0 : post.author.toString()) !== user._id.toString())
            return res.sendStatus(401);
        const updatedPost = yield Post_1.PostModel.findOneAndUpdate({ _id: postID }, valData.value);
        if (!updatedPost)
            return res.sendStatus(404);
        return res.status(200).json(updatedPost);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.updatePost = updatePost;
const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const limit = req.query.limit || 20;
    const skip = req.query.skip || 0;
    try {
        const comments = yield Post_1.CommentModel.find({ postID: postID })
            .skip(skip)
            .limit(limit)
            .select(["-__v"]);
        return res.status(200).json(comments);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getPostComments = getPostComments;
const addPostComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const valData = yield (0, post_validator_1.validateCommentCreateData)(req.body);
    const post = yield Post_1.PostModel.findOne({ _id: postID });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.communityID) {
        const userCommunities = req.user.communities.map((commID) => {
            return commID.toString();
        });
        if (!userCommunities.includes(post.communityID.toString))
            return res.status(401).json({ message: "Cannot comment on this post" });
    }
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    try {
        const newComment = yield new Post_1.CommentModel(Object.assign(Object.assign({}, valData.value), { postID: postID, author: req.user._id })).save();
        (_b = post.comments) === null || _b === void 0 ? void 0 : _b.push(newComment._id);
        post.numberOfComments += 1;
        yield post.save();
        const notificationInfo = {
            message: `${req.user.profile.fullName} commented on your post`,
            user: req.user._id,
            type: "post",
            userID: post.author._id,
            post: post._id
        };
        res.status(201).json(newComment.populate({
            path: "comments",
            select: "-__v",
            populate: {
                path: "author",
                select: "profile.fullName profile.picture"
            }
        }));
        yield (0, notification_1.sendNotification)(req.socket, notificationInfo, post.author._id.toString());
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.addPostComment = addPostComment;
const postUpVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const post = yield Post_1.PostModel.findOne({ _id: postID });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.communityID) {
        const userCommunities = req.user.communities.map((commID) => {
            return commID.toString();
        });
        if (!userCommunities.includes(post.communityID.toString))
            return res.status(401).json({ message: "Cannot Like this post" });
    }
    const upvoted = (_c = post.upvoteBy) === null || _c === void 0 ? void 0 : _c.some((objectid) => {
        return objectid.equals(req.user._id);
    });
    if (!upvoted) {
        (_d = post.upvoteBy) === null || _d === void 0 ? void 0 : _d.push(req.user._id);
        post.upvotes += 1;
    }
    try {
        yield post.save();
        const notificationInfo = {
            message: `${req.user.profile.fullName} liked your post`,
            user: req.user._id,
            type: "post",
            userID: post.author._id,
            post: post._id
        };
        res.sendStatus(200);
        yield (0, notification_1.sendNotification)(req.io, notificationInfo, post.author._id.toString());
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.postUpVote = postUpVote;
const postDownVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const post = yield Post_1.PostModel.findOne({ _id: postID });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.communityID) {
        const userCommunities = req.user.communities.map((commID) => {
            return commID.toString();
        });
        if (!userCommunities.includes(post.communityID.toString))
            return res.status(401).json({ message: "Cannot Like this post" });
    }
    const result = (_e = post.upvoteBy) === null || _e === void 0 ? void 0 : _e.filter((objectID) => objectID.toString() !== req.user._id.toString());
    post.upvoteBy = result;
    post.upvotes = ((_f = post.upvoteBy) === null || _f === void 0 ? void 0 : _f.length) || 0;
    try {
        yield post.save();
        res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.postDownVote = postDownVote;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentID = new mongoose_1.Types.ObjectId(req.params.commentID);
    const comment = yield Post_1.CommentModel.findOne({ _id: commentID });
    if (!comment)
        return res.status(400).json({ message: "Comment not found" });
    if (comment.author.toString() !== req.user._id.toString())
        return res
            .status(401)
            .json({ message: "You are unauthorized to delete this comment" });
    try {
        yield comment.delete();
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.deleteComment = deleteComment;
