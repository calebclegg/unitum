import { Router } from "express";
import * as controller from "../controllers/contactUs";

const router = Router();

router.post("/", controller.newContact);

export default router;
