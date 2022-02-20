import { Router } from "express";
import * as controller from "../controllers/user";
import * as sveController from "../controllers/savedPost";
import { getUser } from "../middlewares/user.middleware";
import { use } from "../utils/use";

const router = Router();

router.get("/me", getUser, use(controller.userInfo));

router.patch("/me", getUser, use(controller.updateUserInfo));

router.get("/me/posts", getUser, use(controller.getUserPosts));

router.get("/me/communities", getUser, use(controller.getUserCommunities));

// router.get("/me/education/:edID", getUser, use(controller.getEducation));

// router.post("/me/education", getUser, use(controller.addNewEducation));

// router.patch("/me/education/:edID", getUser, use(controller.editEducation));

// router.delete("/me/education/:edID", getUser, use(controller.deleteEducation));

router.post("/me/schoolWork", getUser, use(controller.newSchoolWork));

router.get("/me/schoolWork", getUser, use(controller.getUserSchoolWork));

router.patch(
  "/me/schoolWork/:workID",
  getUser,
  use(controller.updateSchoolwork)
);

router.delete(
  "/me/schoolWork/:workID",
  getUser,
  use(controller.deleteSchoolwork)
);

router.get(
  "/me/notifications",
  getUser,
  use(controller.getUnreadNotifications)
);

router.delete(
  "/me/notifications/delete",
  getUser,
  use(controller.deleteNotification)
);

router.get("/me/savedPosts", getUser, use(sveController.getSavedPosts));

router.post("/me/savedPosts", getUser, use(sveController.saveAPost));

router.delete("/me/savedPosts/:postID", getUser, use(sveController.unsavePost));

export default router;
