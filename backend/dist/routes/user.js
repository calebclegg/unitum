"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("../controllers/user"));
const sveController = __importStar(require("../controllers/savedPost"));
const user_middleware_1 = require("../middlewares/user.middleware");
const use_1 = require("../utils/use");
const router = (0, express_1.Router)();
router.post("/follow/:userID", user_middleware_1.getUser, (0, use_1.use)(controller.followUser));
router.patch("/unfollow/:userID", user_middleware_1.getUser, (0, use_1.use)(controller.unfollowUser));
router.get("/", user_middleware_1.getUser, (0, use_1.use)(controller.userInfo));
router.patch("/", user_middleware_1.getUser, (0, use_1.use)(controller.updateUserInfo));
router.get("/posts", user_middleware_1.getUser, (0, use_1.use)(controller.getUserPosts));
router.get("/communities", user_middleware_1.getUser, (0, use_1.use)(controller.getUserCommunities));
// router.get("/education/:edID", getUser, use(controller.getEducation));
// router.post("/education", getUser, use(controller.addNewEducation));
// router.patch("/education/:edID", getUser, use(controller.editEducation));
// router.delete("/education/:edID", getUser, use(controller.deleteEducation));
router.post("/schoolWork", user_middleware_1.getUser, (0, use_1.use)(controller.newSchoolWork));
router.get("/schoolWork", user_middleware_1.getUser, (0, use_1.use)(controller.getUserSchoolWork));
router.patch("/schoolWork/:workID", user_middleware_1.getUser, (0, use_1.use)(controller.updateSchoolwork));
router.delete("/schoolWork/:workID", user_middleware_1.getUser, (0, use_1.use)(controller.deleteSchoolwork));
router.get("/notifications", user_middleware_1.getUser, (0, use_1.use)(controller.getUnreadNotifications));
router.delete("/notifications/:notID/delete", user_middleware_1.getUser, (0, use_1.use)(controller.deleteNotification));
router.delete("/notifications/delete", user_middleware_1.getUser, (0, use_1.use)(controller.markAllAsRead));
router.patch("/education", user_middleware_1.getUser, (0, use_1.use)(controller.editEducation));
router.get("/savedPosts", user_middleware_1.getUser, (0, use_1.use)(sveController.getSavedPosts));
router.post("/savedPosts", user_middleware_1.getUser, (0, use_1.use)(sveController.saveAPost));
router.delete("/savedPosts/:postID", user_middleware_1.getUser, (0, use_1.use)(sveController.unsavePost));
exports.default = router;
