import { Router } from "express";
import * as controller from "../controllers/user";
const router = Router();

//set route and it's controller
router.post("/", controller.register);

export default router;
