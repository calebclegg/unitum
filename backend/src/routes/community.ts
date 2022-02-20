import { Router } from "express";
import * as controller from "../controllers/community";
import { getUser } from "../middlewares/user.middleware";
import { use } from "../utils/use";
import { getPostWithCommID } from "../controllers/post";

const router = Router();

router.get("/posts", getUser, use(getPostWithCommID));
// get a specify community
// search for community
router.get("/", getUser, use(controller.searchCommunity));
router.get("/:commID", getUser, use(controller.viewCommunity));
// get edit a community

router.patch("/:commID", getUser, use(controller.editCommunity));

// create a community
router.post("/", getUser, use(controller.createCommunity));

// delete a community
router.delete("/:commID", getUser, use(controller.deleteCommunity));

router.get("/:commID/members", getUser, use(controller.getCommunityMembers));

router.post("/:commID/add", getUser, use(controller.addMember));

router.delete("/:commID/remove", getUser, use(controller.removeMember));

router.delete("/:commID/leave", getUser, use(controller.leaveCommunity));

router.post("/:commID/join", getUser, use(controller.joinCommunity));

router.get("/:commID/requests", getUser, use(controller.getJoinRequests));

// delete a community
router.delete("/:commID", getUser, use(controller.deleteCommunity));

export default router;
