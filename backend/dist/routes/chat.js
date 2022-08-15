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
const controller = __importStar(require("../controllers/chat"));
const user_middleware_1 = require("../middlewares/user.middleware");
const use_1 = require("../utils/use");
const router = (0, express_1.Router)();
router.post("/new", user_middleware_1.getUser, (0, use_1.use)(controller.newChat));
router.get("/:chatID", user_middleware_1.getUser, (0, use_1.use)(controller.getChatMessages));
router.post("/:chatID", user_middleware_1.getUser, (0, use_1.use)(controller.sendMessage));
router.get("/messages/unread", user_middleware_1.getUser, (0, use_1.use)(controller.getUnreadMessages));
router.patch("/messages/read", user_middleware_1.getUser, (0, use_1.use)(controller.markAsRead));
router.get("/", user_middleware_1.getUser, (0, use_1.use)(controller.getChats));
exports.default = router;
