import { Router } from "express";
import * as controller from "../controllers/user";
import { getUser } from "../middlewares/user.middleware";
const router = Router();

router.get("/me", getUser, controller.userInfo);

router.patch("/me", getUser, controller.updateUserInfo);

router.get("/me/education/:edID", getUser, controller.getEducation);

router.post("/me/education", getUser, controller.addNewEducation);

router.patch("/me/education/:edID", getUser, controller.editEducation);

router.delete("/me/education/:edID", getUser, controller.deleteEducation);

router.post("/me/schoolWork", getUser, controller.newSchoolWork);

router.patch("/me/schoolWork/:workID", getUser, controller.updateSchoolwork);

router.delete("/me/schoolWork/:workID", getUser, controller.deleteSchoolwork);

router.get("/me/notifications", getUser, controller.getUnreadNotifications);

router.delete(
  "/me/notifications/delete",
  getUser,
  controller.deleteNotification
);

export default router;
