import * as controller from "../controllers/post";
import { Router } from "express";
import { getUser } from "../middlewares/user.middleware";

const router = Router();

// create a post
router.post("/", getUser, controller.createPost);
// get posts
router.get("/", getUser, controller.getPosts);

// get post details
router.get("/:postID", getUser, controller.getPostDetails);

// delete a post
router.delete("/:postID", getUser, controller.deletePost);

// update a post
router.patch("/:postID", getUser, controller.updatePost);
export default router;
