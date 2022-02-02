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
const controller = __importStar(require("../controllers/community"));
const user_middleware_1 = require("../middlewares/user.middleware");
const router = (0, express_1.Router)();
// get a specify community
router.get("/:commID", user_middleware_1.getUser, controller.viewCommunity);
// search for community
router.get("/", user_middleware_1.getUser, controller.searchCommunity);
// get edit a community
router.patch("/:commID", user_middleware_1.getUser, controller.editCommunity);
// create a community
router.post("/", user_middleware_1.getUser, controller.createCommunity);
// delete a community
router.delete("/:commID", user_middleware_1.getUser, controller.deleteCommunity);
router.post("/:commID/add", user_middleware_1.getUser, controller.addMember);
router.delete("/:commID/remove", user_middleware_1.getUser, controller.removeMember);
router.delete("/:commID/leave", user_middleware_1.getUser, controller.leaveCommunity);
// delete a community
router.delete("/:commID", user_middleware_1.getUser, controller.deleteCommunity);
exports.default = router;
