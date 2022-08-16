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
exports.redisConnect = exports.redisClient = void 0;
const redis_om_1 = require("redis-om");
exports.redisClient = new redis_om_1.Client();
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    let limit = 5;
    if (!exports.redisClient.isOpen()) {
        try {
            yield exports.redisClient.open(process.env.REDIS_URI);
            console.log("Redis server running...");
        }
        catch (error) {
            while (limit > 0) {
                limit--;
                console.log("Unable to connect to redis sever!!\n Reconnecting...");
                yield (0, exports.redisConnect)();
                console.log(limit);
            }
            console.log("Couldn't connect to redis");
            process.exit(1);
        }
    }
});
exports.redisConnect = redisConnect;
