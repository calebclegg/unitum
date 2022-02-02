"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Token_1 = require("../utils/Token");
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null)
        return res.status(400).json({ message: "Authorization header not set" });
    let payload;
    try {
        payload = yield (0, Token_1.decodeToken)(token, "access");
    }
    catch (error) {
        return res.sendStatus(403);
    }
    if (!payload)
        return res.status(400).json({ message: "Invalid jwt token" });
    try {
        const user = yield User_1.default.findOne({ email: payload.sub }).select([
            "-createdAt",
            "-updatedAt",
            "-role",
            "-__v",
            "+profile"
        ]);
        if (!user)
            return res.status(400).json({ message: "User does not exist" });
        req.user = user;
        next();
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getUser = getUser;
