import { Router } from "express";
import * as controller from "../controllers/user";
const router = Router();
import {validateUserRegData, validateUserLogData} from "../middlewares/user.middleware"
//set route and it's controller
router.post("/register", validateUserRegData, controller.register);

router.post("/login", validateUserLogData, controller.login)

router.post("/authProvider", controller.checkAuthProvider)

router.post("/auth", controller.externalAuth)

export default router;
