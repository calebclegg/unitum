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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const Notification_1 = require("../models/Notification");
const server_1 = require("../server");
const sendNotification = (content, to) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newNotification = yield new Notification_1.Notification(content).save();
        server_1.io.to(to).emit("new notification", newNotification.populate({
            path: "user",
            select: "profile.fullName profile.picture"
        }));
    }
    catch (e) {
        console.log(e);
    }
});
exports.sendNotification = sendNotification;
