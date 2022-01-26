import { Router } from "express";
import * as controller from "../controllers/user";
import { getUser } from "../middlewares/user.middleware";
const router = Router();

router.get("/me", getUser, controller.userInfo);

router.patch("/me", getUser, controller.updateUserInfo);

export default router;
