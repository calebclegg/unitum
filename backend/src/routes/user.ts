import { Router } from "express";
import * as controller from "../controllers/user";
import { getUser } from "../middlewares/user.middleware";
const router = Router();

router.get("/me", getUser, controller.userInfo);

router.patch("/me", getUser, controller.updateUserInfo);

router.post("/me/education", getUser, controller.addNewEduction);

router.patch("/me/education/:edID", getUser, controller.editEduction);

export default router;
