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
exports.validateCommEditData = exports.validateCommCreateData = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCommCreateData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const commSchema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(30).required(),
        description: joi_1.default.string().max(150),
        picture: joi_1.default.string()
    });
    return commSchema.validate(data);
});
exports.validateCommCreateData = validateCommCreateData;
const validateCommEditData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const commSchema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(30),
        description: joi_1.default.string().max(150),
        picture: joi_1.default.string()
    });
    return commSchema.validate(data);
});
exports.validateCommEditData = validateCommEditData;
