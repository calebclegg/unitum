import * as controller from "../controllers/post";
import { Router } from "express";
import { getUser } from "../middlewares/user.middleware";
import { use } from "../utils/use";

const router = Router();

// create a post
router.post("/", getUser, use(controller.createPost));
// get posts
router.get("/", getUser, use(controller.getPosts));

// get post details
router.get("/:postID", getUser, use(controller.getPostDetails));

// delete a post
router.delete("/:postID", getUser, use(controller.deletePost));

// update a post
router.patch("/:postID", getUser, use(controller.updatePost));

router.get("/:postID/comments", getUser, use(controller.getPostComments));

router.post("/:postID/comments", getUser, use(controller.addPostComment));

router.patch("/:postID/upvote", getUser, use(controller.postUpVote));
router.patch("/:postID/downvote", getUser, use(controller.postDownVote));
router.delete("/comments/:commentID", getUser, use(controller.deleteComment));

export default router;
