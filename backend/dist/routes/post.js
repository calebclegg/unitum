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
Object.defineProperty(exports, "__esModule", { value: true });
const controller = __importStar(require("../controllers/post"));
const express_1 = require("express");
const user_middleware_1 = require("../middlewares/user.middleware");
const use_1 = require("../utils/use");
const router = (0, express_1.Router)();
// create a post
router.post("/", user_middleware_1.getUser, (0, use_1.use)(controller.createPost));
// get posts
router.get("/", user_middleware_1.getUser, (0, use_1.use)(controller.getPosts));
// get post details
router.get("/:postID", user_middleware_1.getUser, (0, use_1.use)(controller.getPostDetails));
// delete a post
router.delete("/:postID", user_middleware_1.getUser, (0, use_1.use)(controller.deletePost));
// update a post
router.patch("/:postID", user_middleware_1.getUser, (0, use_1.use)(controller.updatePost));
router.get("/:postID/comments", user_middleware_1.getUser, (0, use_1.use)(controller.getPostComments));
router.post("/:postID/comments", user_middleware_1.getUser, (0, use_1.use)(controller.addPostComment));
router.patch("/:postID/upvote", user_middleware_1.getUser, (0, use_1.use)(controller.postUpVote));
router.patch("/:postID/downvote", user_middleware_1.getUser, (0, use_1.use)(controller.postDownVote));
router.delete("/comments/:commentID", user_middleware_1.getUser, (0, use_1.use)(controller.deleteComment));
exports.default = router;
