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
exports.deleteRefreshToken = exports.retrieveRefreshToken = exports.saveRefreshToken = exports.decodeToken = exports.createRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_connect_1 = require("../config/redis_connect");
const createToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken = {
        sub: user.email,
        iss: process.env.JWT_ISSUER
    };
    const token = jsonwebtoken_1.default.sign(dataStoredInToken, secret, { expiresIn: "10m" });
    return token;
});
exports.createToken = createToken;
const createRefreshToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.RF_TOKEN_SECRET;
    const dataStoredInToken = {
        sub: user.email,
        iss: process.env.JWT_ISSUER
    };
    const token = jsonwebtoken_1.default.sign(dataStoredInToken, secret, { expiresIn: "7d" });
    return token;
});
exports.createRefreshToken = createRefreshToken;
const decodeToken = (jwtString, type) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenTypes = {
        access: {
            secret: process.env.JWT_SECRET || "",
            maxAge: process.env.JWT_EXPIRE_TIME || ""
        },
        refresh: {
            secret: process.env.RF_TOKEN_SECRET || "",
            maxAge: process.env.RF_EXPIRE_TIME || ""
        }
    };
    const options = {
        issuer: process.env.JWT_ISSUER
    };
    const payload = jsonwebtoken_1.default.verify(jwtString, tokenTypes[type].secret, options);
    return payload;
});
exports.decodeToken = decodeToken;
const saveRefreshToken = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_connect_1.redisConnect)();
    yield redis_connect_1.redisClient.execute(["SET", email, token]);
    yield redis_connect_1.redisClient.execute(["expire", email, 691200]);
});
exports.saveRefreshToken = saveRefreshToken;
const retrieveRefreshToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_connect_1.redisConnect)();
    const token = yield redis_connect_1.redisClient.execute(["GET", email]);
    return token;
});
exports.retrieveRefreshToken = retrieveRefreshToken;
const deleteRefreshToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_connect_1.redisConnect)();
    yield redis_connect_1.redisClient.execute(["DEL", email]);
});
exports.deleteRefreshToken = deleteRefreshToken;
