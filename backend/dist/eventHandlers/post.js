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
exports.postHandlers = void 0;
const Post_1 = require("../models/Post");
const postHandlers = (io, socket) => __awaiter(void 0, void 0, void 0, function* () {
    const likePost = (postID) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!postID)
            return socket.to(socket.id).emit("Bad Request", "postID is required");
        const post = yield Post_1.PostModel.findOne({ _id: postID });
        if (!post)
            return socket.to(socket.id).emit("Not Found", "Post not found");
        if (post.communityID) {
            const userCommunities = socket.data.user.communities.map((commID) => {
                return commID.toString();
            });
            if (!userCommunities.includes(post.communityID.toString))
                return res.status(401).json({ message: "Cannot Like this post" });
        }
        const upvoted = (_a = post.upvoteBy) === null || _a === void 0 ? void 0 : _a.some((objectid) => {
            return objectid.equals(req.user._id);
        });
        if (upvoted) {
            const result = (_b = post.upvoteBy) === null || _b === void 0 ? void 0 : _b.filter((objectID) => objectID.toString() !== req.user._id.toString());
            post.upvoteBy = result;
            post.upvotes -= 1;
        }
        else {
            (_c = post.upvoteBy) === null || _c === void 0 ? void 0 : _c.push(req.user._id);
            post.upvotes += 1;
        }
        try {
            yield post.save();
            return res.sendStatus(200);
        }
        catch (error) {
            return res.sendStatus(500);
        }
    });
});
exports.postHandlers = postHandlers;
