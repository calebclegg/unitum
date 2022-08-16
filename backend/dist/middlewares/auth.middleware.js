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
exports.validateUserLogData = exports.validateUserRegData = void 0;
const user_validator_1 = require("../validators/user.validator");
const User_1 = __importDefault(require("../models/User"));
function validateUserRegData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const valData = (0, user_validator_1.validateRegUser)(req.body);
        let errors;
        if (valData.error) {
            errors = valData.error.details.map((error) => {
                var _a;
                return ({
                    label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                    message: error.message
                });
            });
            return res
                .status(400)
                .json({ message: "Some fields are invalid/required", errors: errors });
        }
        const user = yield User_1.default.findOne({ email: valData.value.email });
        if (user) {
            return res.status(409).send("User with this email already exist");
        }
        next();
    });
}
exports.validateUserRegData = validateUserRegData;
function validateUserLogData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const valData = (0, user_validator_1.validateLogUser)(req.body);
        let errors;
        if (valData.error) {
            errors = valData.error.details.map((error) => {
                var _a;
                return ({
                    label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                    message: error.message
                });
            });
            return res
                .status(400)
                .json({ message: "Some fields are invalid/required", errors: errors });
        }
        const user = yield User_1.default.findOne({ email: valData.value.email }).select([
            "+authProvider",
            "+password"
        ]);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user.authProvider !== "LOCAL")
            return res
                .status(409)
                .json({ message: "This email is associated with a another provider" });
        req.user = user;
        next();
    });
}
exports.validateUserLogData = validateUserLogData;
