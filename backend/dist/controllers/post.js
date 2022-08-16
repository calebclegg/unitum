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
exports.getPostWithCommID = exports.deleteComment = exports.postDownVote = exports.postUpVote = exports.addPostComment = exports.getPostComments = exports.updatePost = exports.deletePost = exports.getPostDetails = exports.getPosts = exports.createPost = void 0;
const mongoose_1 = require("mongoose");
const Community_1 = __importDefault(require("../models/Community"));
const Post_1 = require("../models/Post");
const SavedPost_1 = require("../models/SavedPost");
const User_1 = __importDefault(require("../models/User"));
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
        community = yield Community_1.default.findOne({
            _id: valData.value.communityID
        });
        if (!community)
            return res.status(404).json({ message: "Community not found" });
    }
    const newPost = yield new Post_1.PostModel(Object.assign(Object.assign({}, valData.value), { author: user._id })).save();
    const post = Object.assign(Object.assign({}, newPost.toObject()), { author: {
            profile: {
                fullName: user.profile.fullName,
                picture: user.profile.picture
            }
        } });
    delete post.upvoteBy;
    delete post.downVoteBy;
    delete post.nextCoyn;
    res.status(201).json(post);
    if (community) {
        const notificationInfo = {
            message: `${req.user.profile.fullName} added a new post in ${community.name}`,
            type: "post",
            user: user._id,
            post: newPost._id
        };
        yield (0, notification_1.sendNotification)(notificationInfo, community._id.toString());
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
    if (communityID) {
        dbPosts = yield Post_1.PostModel.find({ communityID: communityID })
            .sort("createdAt")
            .select("-comments +upvoteBy")
            .populate([
            { path: "author", select: "profile.fullName profile.picture" },
            { path: "communityID", select: "-__v" }
        ])
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }
    else {
        dbPosts = yield Post_1.PostModel.find({})
            .sort("createdAt")
            .select("-comments +upvoteBy")
            .populate([
            { path: "author", select: "profile.fullName profile.picture" },
            { path: "communityID", select: "-__v" }
        ])
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }
    const savedPosts = yield SavedPost_1.SavedPost.findOne({ userID: user._id });
    const posts = dbPosts.map((post) => {
        var _a, _b;
        const upvoted = (_a = post.upvoteBy) === null || _a === void 0 ? void 0 : _a.some((objectid) => {
            return objectid.equals(user._id);
        });
        const downvoted = (_b = post.downVoteBy) === null || _b === void 0 ? void 0 : _b.some((objectid) => {
            return objectid.equals(req.user._id);
        });
        let saved = false;
        if (savedPosts) {
            saved = savedPosts.posts.some((objectid) => {
                return objectid.equals(post._id);
            });
        }
        post = Object.assign(Object.assign({}, post.toObject()), { upvoted: upvoted, downvoted: downvoted, saved: saved });
        delete post.upvoteBy;
        delete post.downVoteBy;
        return post;
    });
    const commPosts = posts.filter((post) => {
        if (post.communityID) {
            const inc = user.profile.communities.some((commID) => {
                return commID.equals(post.communityID._id);
            });
            if (inc)
                return post;
        }
        else if (!post.communityID) {
            return post;
        }
        return;
    });
    // const wallPosts = posts.filter((post: IPost) => {
    //   if (!post.communityID) return post;
    // });
    return res.status(200).json([...commPosts]);
});
exports.getPosts = getPosts;
// get post details
const getPostDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    let post = yield Post_1.PostModel.findOne({ _id: postID }).populate([
        {
            path: "author",
            select: "profile.fullName profile.picture"
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
    ]);
    if (!post)
        return res.sendStatus(404);
    const savedPosts = yield SavedPost_1.SavedPost.findOne({ userID: req.user._id });
    let saved = false;
    if (savedPosts) {
        saved = savedPosts.posts.some((objectid) => {
            return objectid.equals(post._id);
        });
    }
    const upvoted = (_a = post.upvoteBy) === null || _a === void 0 ? void 0 : _a.some((objectid) => {
        return objectid.equals(req.user._id);
    });
    const downvoted = (_b = post.downVoteBy) === null || _b === void 0 ? void 0 : _b.some((objectid) => {
        return objectid.equals(req.user._id);
    });
    post = Object.assign(Object.assign({}, post.toObject()), { upvoted: upvoted, downvoted: downvoted, saved: saved });
    delete post.upvoteBy;
    delete post.downVoteBy;
    return res.status(200).json(post);
});
exports.getPostDetails = getPostDetails;
// delete a post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const post = yield Post_1.PostModel.findOne({ _id: postID });
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
    const post = yield Post_1.PostModel.findOne({ _id: postID });
    if (!post)
        return res.sendStatus(404);
    if ((post === null || post === void 0 ? void 0 : post.author.toString()) !== user._id.toString())
        return res.sendStatus(401);
    const updatedPost = yield Post_1.PostModel.findOneAndUpdate({ _id: postID }, valData.value).select("-upvoteBy -downVoteBy");
    if (!updatedPost)
        return res.sendStatus(404);
    return res.status(200).json(updatedPost);
});
exports.updatePost = updatePost;
const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const limit = req.query.limit || 20;
    const skip = req.query.skip || 0;
    const comments = yield Post_1.CommentModel.find({ postID: postID })
        .skip(skip)
        .limit(limit)
        .select(["-__v"])
        .populate({
        path: "author",
        select: "profile.fullName profile.picture"
    });
    return res.status(200).json(comments);
});
exports.getPostComments = getPostComments;
const addPostComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const valData = yield (0, post_validator_1.validateCommentCreateData)(req.body);
    const post = yield Post_1.PostModel.findOne({ _id: postID });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.communityID) {
        const userCommunities = req.user.profile.communities.map((commID) => {
            return commID.toString();
        });
        if (!userCommunities.includes(post.communityID.toString()))
            return res.status(401).json({ message: "Cannot comment on this post" });
    }
    let errors;
    if (valData.error) {
        errors = (_c = valData.error.details) === null || _c === void 0 ? void 0 : _c.map((error) => {
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
    const newComment = yield new Post_1.CommentModel(Object.assign(Object.assign({}, valData.value), { postID: postID, author: req.user._id })).save();
    (_d = post.comments) === null || _d === void 0 ? void 0 : _d.push(newComment._id);
    post.numberOfComments += 1;
    yield post.save();
    res.sendStatus(201);
    if (!(req.user._id.toString() === post.author.toString())) {
        const notificationInfo = {
            message: `${req.user.profile.fullName} commented on your post`,
            user: req.user._id,
            type: "comment",
            userID: post.author._id,
            post: post._id
        };
        yield (0, notification_1.sendNotification)(notificationInfo, post.author.toString());
    }
});
exports.addPostComment = addPostComment;
const postUpVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k, _l;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const post = yield Post_1.PostModel.findOne({ _id: postID }).select("+nextCoyn");
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.communityID) {
        const isMember = req.user.profile.communities.some((objectid) => {
            return objectid.equals(post.communityID);
        });
        if (!isMember)
            return res.status(401).json({ message: "Cannot Like this post" });
        // const userCommunities = req.user.communities.map(
        //   (commID: Types.ObjectId) => {
        //     return commID.toString();
        //   }
        // );
        // if (!userCommunities.includes(post.communityID.toString))
        //   return res.status(401).json({ message: "Cannot Like this post" });
    }
    const upvoted = (_e = post.upvoteBy) === null || _e === void 0 ? void 0 : _e.some((objectid) => {
        return objectid.equals(req.user._id);
    });
    const downVoted = (_f = post.downVoteBy) === null || _f === void 0 ? void 0 : _f.some((objectid) => {
        return objectid.equals(req.user._id);
    });
    if (downVoted) {
        const result = (_g = post.downVoteBy) === null || _g === void 0 ? void 0 : _g.filter((objectID) => objectID.toString() !== req.user._id.toString());
        post.downVoteBy = result;
    }
    if (upvoted) {
        const result = (_h = post.upvoteBy) === null || _h === void 0 ? void 0 : _h.filter((objectID) => objectID.toString() !== req.user._id.toString());
        post.upvoteBy = result;
    }
    else {
        (_j = post.upvoteBy) === null || _j === void 0 ? void 0 : _j.push(req.user._id);
    }
    post.upvotes = post.upvoteBy.length - post.downVoteBy.length || 0;
    post.downvotes = ((_k = post.downVoteBy) === null || _k === void 0 ? void 0 : _k.length) || 0;
    yield post.save();
    res.sendStatus(200);
    if (!(req.user._id.toString() === post.author.toString()) && !upvoted) {
        const notificationInfo = {
            message: `${req.user.profile.fullName} liked your post`,
            user: req.user._id,
            type: "like",
            userID: post.author._id,
            post: post._id
        };
        yield (0, notification_1.sendNotification)(notificationInfo, post.author.toString());
    }
    if (((_l = post.upvoteBy) === null || _l === void 0 ? void 0 : _l.length) === post.nextCoyn) {
        const user = yield User_1.default.findOne({ _id: post.author });
        if (user === null || user === void 0 ? void 0 : user.profile)
            user.profile.unicoyn += 1;
        post.nextCoyn += 100;
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield post.save();
        const notificationInfo = {
            message: `Congratulations, you have received 1 unicoyn`,
            userID: post.author,
            type: "post",
            post: post.id
        };
        yield (0, notification_1.sendNotification)(notificationInfo, post.author.toString());
    }
});
exports.postUpVote = postUpVote;
const postDownVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p, _q, _r, _s;
    const postID = new mongoose_1.Types.ObjectId(req.params.postID);
    const post = yield Post_1.PostModel.findOne({ _id: postID });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.communityID) {
        const userCommunities = req.user.profile.communities.map((commID) => {
            return commID.toString();
        });
        if (!userCommunities.includes(post.communityID.toString))
            return res.status(401).json({ message: "Cannot Like this post" });
    }
    const upvoted = (_m = post.upvoteBy) === null || _m === void 0 ? void 0 : _m.some((objectid) => {
        return objectid.equals(req.user._id);
    });
    const downVoted = (_o = post.downVoteBy) === null || _o === void 0 ? void 0 : _o.some((objectid) => {
        return objectid.equals(req.user._id);
    });
    if (upvoted) {
        const result = (_p = post.upvoteBy) === null || _p === void 0 ? void 0 : _p.filter((objectID) => objectID.toString() !== req.user._id.toString());
        post.upvoteBy = result;
    }
    if (downVoted) {
        const result = (_q = post.downVoteBy) === null || _q === void 0 ? void 0 : _q.filter((objectID) => objectID.toString() !== req.user._id.toString());
        post.downVoteBy = result;
    }
    else {
        (_r = post.downVoteBy) === null || _r === void 0 ? void 0 : _r.push(req.user._id);
    }
    post.upvotes = post.upvoteBy.length - post.downVoteBy.length || 0;
    post.downvotes = ((_s = post.downVoteBy) === null || _s === void 0 ? void 0 : _s.length) || 0;
    yield post.save();
    res.sendStatus(200);
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
    yield comment.delete();
    return res.sendStatus(200);
});
exports.deleteComment = deleteComment;
const getPostWithCommID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit } = req.query;
    const dbposts = yield Post_1.PostModel.find({ communityID: { $exists: true } })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .select("-comments +upvoteBy")
        .populate([
        { path: "author", select: "profile.fullName profile.picture" },
        { path: "communityID", select: "_id name picture createdAt" }
    ]);
    const posts = dbposts.map((post) => {
        const postObj = Object.assign({}, post.toObject());
        delete postObj.upvoteBy;
        delete postObj.downVoteBy;
        delete postObj.comments;
        return postObj;
    });
    return res.json(posts);
});
exports.getPostWithCommID = getPostWithCommID;
