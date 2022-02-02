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
exports.logout = exports.getNewAccessToken = exports.externalAuth = exports.checkAuthProvider = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const Token_1 = require("../utils/Token");
const user_validator_1 = require("../validators/user.validator");
const dataNormalizer_1 = require("../utils/dataNormalizer");
const Token_2 = require("../utils/Token");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new User_1.default(Object.assign(Object.assign({}, req.body), { authProvider: req.body.authProvider || "LOCAL", role: "active" }));
    try {
        const savedUser = yield newUser.save();
        const accessToken = yield (0, Token_1.createToken)(savedUser);
        const refreshToken = yield (0, Token_1.createRefreshToken)(savedUser);
        try {
            yield (0, Token_2.saveRefreshToken)(req.body.email, refreshToken);
        }
        catch (error) { }
        res.status(201).json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const isVerified = yield user.verifyPassword(req.body.password);
    if (!isVerified)
        return res.status(400).json({ message: "Password is incorrect" });
    const accessToken = yield (0, Token_1.createToken)(user);
    const refreshToken = yield (0, Token_1.createRefreshToken)(user);
    try {
        yield (0, Token_2.saveRefreshToken)(user.email, refreshToken);
    }
    catch (error) { }
    return res.status(200).json({ accessToken, refreshToken });
});
exports.login = login;
const checkAuthProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const valData = (0, user_validator_1.validateEmail)(req.body);
    if (valData.error) {
        return res.status(400).json({
            message: "This field is invalid/required",
            errors: valData.error
        });
    }
    let dbUser;
    try {
        dbUser = yield User_1.default.findOne({ email: valData.value.email }).select("+authProvider");
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    if (!dbUser)
        return res
            .status(404)
            .json({ message: "User with this email does not exist" });
    return res
        .status(200)
        .json({ authProvider: dbUser.authProvider, email: dbUser.email });
});
exports.checkAuthProvider = checkAuthProvider;
const externalAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = req.body.authProvider;
    if (!provider) {
        return res.status(400).json({ message: "Authentication Provider not set" });
    }
    let userData;
    if (provider === "GOOGLE") {
        userData = yield (0, dataNormalizer_1.normalizeGoogleData)(req.body);
    }
    let dbUser;
    try {
        dbUser = yield User_1.default.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email }).select("+authProvider");
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    let accessToken, refreshToken;
    if (!dbUser) {
        const newUser = new User_1.default(Object.assign({}, userData));
        try {
            const savedUser = yield newUser.save();
            accessToken = yield (0, Token_1.createToken)(savedUser);
            refreshToken = yield (0, Token_1.createRefreshToken)(savedUser);
            try {
                yield (0, Token_2.saveRefreshToken)(savedUser.email, refreshToken);
            }
            catch (error) { }
            return res.status(201).json({ accessToken, refreshToken });
        }
        catch (error) {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
    if (dbUser.authProvider !== (userData === null || userData === void 0 ? void 0 : userData.authProvider)) {
        return res.status(409).json({
            message: "User with this email is associated with a different provider"
        });
    }
    accessToken = yield (0, Token_1.createToken)(dbUser);
    refreshToken = yield (0, Token_1.createRefreshToken)(dbUser);
    try {
        yield (0, Token_2.saveRefreshToken)(dbUser.email, refreshToken);
    }
    catch (error) { }
    return res.status(200).json({ accessToken, refreshToken });
});
exports.externalAuth = externalAuth;
const getNewAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const refreshToken = req.headers.authorization.split(" ")[1];
    if (!refreshToken)
        return res.status(400).json({ message: "refresh Token required" });
    let tokenData;
    try {
        tokenData = yield (0, Token_1.decodeToken)(refreshToken, "refresh");
    }
    catch (error) {
        return res.status(400).json({ message: "Invalid Token" });
    }
    let redisToken;
    try {
        redisToken = yield (0, Token_1.retrieveRefreshToken)((_a = tokenData.sub) === null || _a === void 0 ? void 0 : _a.toString());
    }
    catch (error) {
        return res.sendStatus(500);
    }
    if (redisToken !== refreshToken) {
        return res.sendStatus(401);
    }
    let dbUser;
    try {
        dbUser = yield User_1.default.findOne({ email: tokenData.sub }).select([
            "+authProvider",
            "+password"
        ]);
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    const accessToken = yield (0, Token_1.createToken)(dbUser);
    const newRefreshToken = yield (0, Token_1.createRefreshToken)(dbUser);
    try {
        yield (0, Token_2.saveRefreshToken)((_b = tokenData.sub) === null || _b === void 0 ? void 0 : _b.toString(), refreshToken);
    }
    catch (error) { }
    return res.status(200).json({ accessToken, newRefreshToken });
});
exports.getNewAccessToken = getNewAccessToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        yield (0, Token_2.deleteRefreshToken)(user.email);
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.logout = logout;
