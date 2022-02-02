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
exports.validateEditSchoolWorkData = exports.validateSchoolWorkData = void 0;
const joi_1 = __importDefault(require("joi"));
const validateSchoolWorkData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        userID: joi_1.default.string(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().max(400),
        media: joi_1.default.array().items(joi_1.default.string()).required(),
        grade: joi_1.default.string().required(),
        date: joi_1.default.date()
    });
    return schema.validate(data);
});
exports.validateSchoolWorkData = validateSchoolWorkData;
const validateEditSchoolWorkData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().max(400),
        media: joi_1.default.array().items(joi_1.default.string()),
        grade: joi_1.default.string().required(),
        date: joi_1.default.date()
    });
    return schema.validate(data);
});
exports.validateEditSchoolWorkData = validateEditSchoolWorkData;
