import { Router } from "express";
import * as controller from "../controllers/chat";
import { getUser } from "../middlewares/user.middleware";
import { use } from "../utils/use";

const router = Router();

router.post("/new", getUser, use(controller.newChat));

router.get("/:chatID", getUser, use(controller.getChatMessages));

router.post("/:chatID", getUser, use(controller.sendMessage));

router.get("/messages/unread", getUser, use(controller.getUnreadMessages));

router.patch("/messages/read", getUser, use(controller.markAsRead));
router.get("/", getUser, use(controller.getChats));

export default router;
