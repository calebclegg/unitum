import { Router } from "express";
import * as controller from "../controllers/auth";
import {
  validateUserRegData,
  validateUserLogData
} from "../middlewares/auth.middleware";

const router = Router();
//set route and it's controller
router.post("/register", validateUserRegData, controller.register);

router.post("/login", validateUserLogData, controller.login);

router.post("/authProvider", controller.checkAuthProvider);

router.post("/oauth", controller.externalAuth);

export default router;
