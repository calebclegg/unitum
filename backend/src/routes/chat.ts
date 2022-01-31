import { Router } from "express";
import * as controller from "../controllers/chat";
import { getUser } from "../middlewares/user.middleware";

const router = Router();

router.get("/:chatID", getUser, controller.getChatMessages);

router.get("/messages/unread", getUser, controller.getUnreadMessages);

router.patch("/messages/read", getUser, controller.markAsRead);

export default router;
