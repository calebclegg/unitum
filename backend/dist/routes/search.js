"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = require("../middlewares/user.middleware");
const search_1 = require("../controllers/search");
const use_1 = require("../utils/use");
const router = (0, express_1.Router)();
router.get("/search", user_middleware_1.getUser, (0, use_1.use)(search_1.search));
exports.default = router;
