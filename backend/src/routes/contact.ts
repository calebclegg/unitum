import { Router } from "express";
import * as controller from "../controllers/contactUs";
import { use } from "../utils/use";

const router = Router();

router.post("/", use(controller.newContact));

export default router;
