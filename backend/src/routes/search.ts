import { Router } from "express";
import { getUser } from "../middlewares/user.middleware";
import { search } from "../controllers/search";

const router = Router();

router.get("/search", getUser, search);

export default router;
