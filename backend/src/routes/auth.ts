import { Router } from "express";
import * as controller from "../controllers/auth";
import { getUser } from "../middlewares/user.middleware";

const router = Router();
import {
  validateUserRegData,
  validateUserLogData
} from "../middlewares/auth.middleware";
//set route and it's controller
router.post("/register", validateUserRegData, controller.register);

router.post("/login", validateUserLogData, controller.login);

router.post("/authProvider", controller.checkAuthProvider);

router.post("/oauth", controller.externalAuth);

router.get("/token", getUser, controller.getNewAccessToken)

export default router;
