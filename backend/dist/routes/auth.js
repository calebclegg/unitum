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
const controller = __importStar(require("../controllers/auth"));
const user_middleware_1 = require("../middlewares/user.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const use_1 = require("../utils/use");
const router = (0, express_1.Router)();
//set route and it's controller
router.post("/register", auth_middleware_1.validateUserRegData, (0, use_1.use)(controller.register));
router.post("/login", auth_middleware_1.validateUserLogData, (0, use_1.use)(controller.login));
router.post("/authProvider", (0, use_1.use)(controller.checkAuthProvider));
router.post("/oauth/:provider", (0, use_1.use)(controller.externalAuth));
router.get("/token", (0, use_1.use)(controller.getNewAccessToken));
router.get("/logout", user_middleware_1.getUser, (0, use_1.use)(controller.logout));
exports.default = router;
