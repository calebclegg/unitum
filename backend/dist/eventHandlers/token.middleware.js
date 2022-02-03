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
const getUser = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = socket.handshake.headers.authorization.split(" ")[1];
    if (token === null)
        next(new Error("Bad request"));
    let payload = "";
    try {
        payload = yield (0, Token_1.decodeToken)(token, "access");
    }
    catch (error) {
        next(new Error("Something went wrong"));
    }
    if (!payload)
        next(new Error("Token has expired"));
    try {
        const user = yield User_1.default.findOne({ email: payload.sub })
            .select(["-createdAt", "-updatedAt", "-role", "-__v", "+profile"])
            .populate([
            { path: "profile.education", select: "-user -__v" },
            {
                path: "profile.communities",
                select: "-admin -members -__v -createdAt -updatedAt"
            }
        ]);
        if (!user)
            next(new Error("User does not exist"));
        socket.user = user;
        next();
    }
    catch (error) {
        return next(new Error("Something went wrong"));
    }
});
exports.getUser = getUser;
