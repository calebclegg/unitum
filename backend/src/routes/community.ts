import { Router } from "express";
import * as controller from "../controllers/community";
import { getUser } from "../middlewares/user.middleware";

const router = Router();

// get a specify community
router.get("/:commID", getUser, controller.viewCommunity);
// search for community
router.get("/", getUser, controller.searchCommunity);
// get edit a community
router.patch("/:commID", getUser, controller.editCommunity);

// create a community
router.post("/", getUser, controller.createCommunity);

// delete a community
router.delete("/:commID", getUser, controller.deleteCommunity);

export default router;
