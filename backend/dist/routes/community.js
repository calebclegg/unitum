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
const use_1 = require("../utils/use");
const post_1 = require("../controllers/post");
const router = (0, express_1.Router)();
router.get("/posts", user_middleware_1.getUser, (0, use_1.use)(post_1.getPostWithCommID));
// get a specify community
// search for community
router.get("/", user_middleware_1.getUser, (0, use_1.use)(controller.searchCommunity));
router.get("/:commID", user_middleware_1.getUser, (0, use_1.use)(controller.viewCommunity));
// get edit a community
router.patch("/:commID", user_middleware_1.getUser, (0, use_1.use)(controller.editCommunity));
// create a community
router.post("/", user_middleware_1.getUser, (0, use_1.use)(controller.createCommunity));
// delete a community
router.delete("/:commID", user_middleware_1.getUser, (0, use_1.use)(controller.deleteCommunity));
router.get("/:commID/members", user_middleware_1.getUser, (0, use_1.use)(controller.getCommunityMembers));
router.post("/:commID/add", user_middleware_1.getUser, (0, use_1.use)(controller.addMember));
router.delete("/:commID/remove", user_middleware_1.getUser, (0, use_1.use)(controller.removeMember));
router.delete("/:commID/leave", user_middleware_1.getUser, (0, use_1.use)(controller.leaveCommunity));
router.post("/:commID/join", user_middleware_1.getUser, (0, use_1.use)(controller.joinCommunity));
router.get("/:commID/requests", user_middleware_1.getUser, (0, use_1.use)(controller.getJoinRequests));
// delete a community
router.delete("/:commID", user_middleware_1.getUser, (0, use_1.use)(controller.deleteCommunity));
exports.default = router;
