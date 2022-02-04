import { Router } from "express";
import * as controller from "../controllers/community";
import { getUser } from "../middlewares/user.middleware";
import { use } from "../utils/use";

const router = Router();

// get a specify community
router.get("/:commID", getUser, use(controller.viewCommunity));
// search for community
router.get("/", getUser, use(controller.searchCommunity));
// get edit a community
router.patch("/:commID", getUser, use(controller.editCommunity));

// create a community
router.post("/", getUser, use(controller.createCommunity));

// delete a community
router.delete("/:commID", getUser, use(controller.deleteCommunity));

router.post("/:commID/add", getUser, use(controller.addMember));

router.delete("/:commID/remove", getUser, use(controller.removeMember));

router.delete("/:commID/leave", getUser, use(controller.leaveCommunity));

// delete a community
router.delete("/:commID", getUser, use(controller.deleteCommunity));

export default router;
