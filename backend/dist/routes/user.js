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
const user_middleware_1 = require("../middlewares/user.middleware");
const router = (0, express_1.Router)();
router.get("/me", user_middleware_1.getUser, controller.userInfo);
router.patch("/me", user_middleware_1.getUser, controller.updateUserInfo);
router.get("/me/education/:edID", user_middleware_1.getUser, controller.getEducation);
router.post("/me/education", user_middleware_1.getUser, controller.addNewEducation);
router.patch("/me/education/:edID", user_middleware_1.getUser, controller.editEducation);
router.delete("/me/education/:edID", user_middleware_1.getUser, controller.deleteEducation);
router.post("/me/schoolWork", user_middleware_1.getUser, controller.newSchoolWork);
router.patch("/me/schoolWork/:workID", user_middleware_1.getUser, controller.updateSchoolwork);
router.delete("/me/schoolWork/:workID", user_middleware_1.getUser, controller.deleteSchoolwork);
router.get("/me/notifications", user_middleware_1.getUser, controller.getUnreadNotifications);
router.delete("/me/notifications/delete", user_middleware_1.getUser, controller.deleteNotification);
exports.default = router;
