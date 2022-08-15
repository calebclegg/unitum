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
exports.validateNewChat = exports.validateMessageData = void 0;
const joi_1 = __importDefault(require("joi"));
const validateMessageData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        text: joi_1.default.string(),
        media: joi_1.default.string()
    }).options({ abortEarly: false });
    return schema.validate(data);
});
exports.validateMessageData = validateMessageData;
const validateNewChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        to: joi_1.default.string().required(),
        text: joi_1.default.string(),
        media: joi_1.default.string()
    }).options({ abortEarly: false });
    return schema.validate(data);
});
exports.validateNewChat = validateNewChat;
