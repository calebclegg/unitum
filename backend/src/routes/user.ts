import { Router } from "express";
import * as controller from "../controllers/user";
import { getUser } from "../middlewares/user.middleware";
const router = Router();

router.get("/me", getUser, controller.userInfo);

router.patch("/me", getUser, controller.updateUserInfo);

router.post("/me/schoolWork", getUser, controller.newSchoolWork);

router.patch("/me/schoolWork/:workID", getUser, controller.updateSchoolwork);

router.delete("/me/schoolWork/:workID", getUser, controller.deleteSchoolwork);

export default router;
