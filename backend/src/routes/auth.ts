import { NextFunction, Router, Response } from "express";
import * as controller from "../controllers/auth";

import { getUser } from "../middlewares/user.middleware";

import {
  validateUserRegData,
  validateUserLogData
} from "../middlewares/auth.middleware";
import { use } from "../utils/use";

const router = Router();
//set route and it's controller
router.post("/register", validateUserRegData, use(controller.register));

router.post("/login", validateUserLogData, use(controller.login));

router.post("/authProvider", use(controller.checkAuthProvider));

router.post("/oauth/:provider", use(controller.externalAuth));

router.get("/token", use(controller.getNewAccessToken));

router.get("/logout", getUser, use(controller.logout));

export default router;
