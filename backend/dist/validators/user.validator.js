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
exports.validateEmail = exports.validateLogUser = exports.validateRegUser = exports.validateUserUpdate = exports.validateEducationEditData = exports.validateEducationData = void 0;
const joi_1 = __importDefault(require("joi"));
const educationSchema = joi_1.default.object({
    school: joi_1.default.object({
        name: joi_1.default.string().required(),
        url: joi_1.default.string()
    }),
    degree: joi_1.default.string(),
    fieldOfStudy: joi_1.default.string().required(),
    startDate: joi_1.default.date().required(),
    grade: joi_1.default.number()
}).options({ abortEarly: false });
const educationEditSchema = joi_1.default.object({
    school: joi_1.default.object({
        name: joi_1.default.string(),
        url: joi_1.default.string()
    }),
    degree: joi_1.default.string(),
    fieldOfStudy: joi_1.default.string(),
    startDate: joi_1.default.date(),
    endDate: joi_1.default.date(),
    grade: joi_1.default.number()
}).options({ abortEarly: false });
const validateEducationData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return educationSchema.validate(data);
});
exports.validateEducationData = validateEducationData;
const validateEducationEditData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return educationEditSchema.validate(data);
});
exports.validateEducationEditData = validateEducationEditData;
const profileSchema = joi_1.default.object({
    fullName: joi_1.default.string().min(2).max(20),
    picture: joi_1.default.string(),
    dob: joi_1.default.date(),
    education: educationSchema,
    communities: joi_1.default.array()
});
const profileUpdateSchema = joi_1.default.object({
    fullName: joi_1.default.string().min(2).max(20),
    picture: joi_1.default.string(),
    dob: joi_1.default.date(),
    education: educationEditSchema
}).options({ abortEarly: false });
function validateRegUser(data) {
    const userSchema = joi_1.default.object({
        fullName: joi_1.default.string().min(2).max(20),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        profile: profileSchema
    }).options({ abortEarly: false });
    return userSchema.validate(data);
}
exports.validateRegUser = validateRegUser;
const validateLogUser = (data) => {
    const UserSchema = joi_1.default.object({
        email: joi_1.default.string().min(6).required().email(),
        password: joi_1.default.string().min(6).required()
    }).options({ abortEarly: false });
    return UserSchema.validate(data);
};
exports.validateLogUser = validateLogUser;
const validateEmail = (data) => {
    const EmailSchema = joi_1.default.object({
        email: joi_1.default.string().min(6).required().email()
    });
    return EmailSchema.validate(data);
};
exports.validateEmail = validateEmail;
const validateUserUpdate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userUpdateSchema = joi_1.default.object({
        profile: profileUpdateSchema
    }).options({ abortEarly: false });
    return userUpdateSchema.validate(data);
});
exports.validateUserUpdate = validateUserUpdate;
