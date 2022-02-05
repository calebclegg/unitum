import { Router } from "express";
import { getUser } from "../middlewares/user.middleware";
import { search } from "../controllers/search";
import { use } from "../utils/use";

const router = Router();

router.get("/search", getUser, use(search));

export default router;
