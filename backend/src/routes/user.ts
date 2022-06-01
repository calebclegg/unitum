import { Router } from "express";
import * as controller from "../controllers/user";
import * as sveController from "../controllers/savedPost";
import { getUser } from "../middlewares/user.middleware";
import { use } from "../utils/use";

const router = Router();

router.post("/follow/:userID", getUser, use(controller.followUser));
router.patch("/unfollow/:userID", getUser, use(controller.unfollowUser));

router.get("/", getUser, use(controller.userInfo));

router.patch("/", getUser, use(controller.updateUserInfo));

router.get("/posts", getUser, use(controller.getUserPosts));

router.get("/communities", getUser, use(controller.getUserCommunities));

// router.get("/education/:edID", getUser, use(controller.getEducation));

// router.post("/education", getUser, use(controller.addNewEducation));

// router.patch("/education/:edID", getUser, use(controller.editEducation));

// router.delete("/education/:edID", getUser, use(controller.deleteEducation));

router.post("/schoolWork", getUser, use(controller.newSchoolWork));

router.get("/schoolWork", getUser, use(controller.getUserSchoolWork));

router.patch("/schoolWork/:workID", getUser, use(controller.updateSchoolwork));

router.delete("/schoolWork/:workID", getUser, use(controller.deleteSchoolwork));

router.get("/notifications", getUser, use(controller.getUnreadNotifications));

router.delete(
  "/notifications/:notID/delete",
  getUser,
  use(controller.deleteNotification)
);

router.delete("/notifications/delete", getUser, use(controller.markAllAsRead));

router.patch("/education", getUser, use(controller.editEducation));
router.get("/savedPosts", getUser, use(sveController.getSavedPosts));

router.post("/savedPosts", getUser, use(sveController.saveAPost));

router.delete("/savedPosts/:postID", getUser, use(sveController.unsavePost));

export default router;
