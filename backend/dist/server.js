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
exports.io = void 0;
const dotenv_flow_1 = require("dotenv-flow");
const express_1 = __importDefault(require("express"));
(0, dotenv_flow_1.config)();
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const community_1 = __importDefault(require("./routes/community"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const post_1 = __importDefault(require("./routes/post"));
const chat_1 = __importDefault(require("./routes/chat"));
const contact_1 = __importDefault(require("./routes/contact"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const redis_connect_1 = require("./config/redis_connect");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const token_middleware_1 = require("./eventHandlers/token.middleware");
const chat_2 = require("./eventHandlers/chat");
const search_1 = __importDefault(require("./routes/search"));
const path_1 = __importDefault(require("path"));
//dotenv conf
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});
exports.io.use(token_middleware_1.getUser);
exports.io.use(wrap(express_1.default.json()));
const onConnection = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.join(socket.user._id.toString());
    socket.user.profile.communities.forEach((comm) => {
        socket.join(comm.toString());
    });
    app.use((req, res, next) => {
        req.io = exports.io;
        req.socket = socket;
        next();
    });
    (0, chat_2.chatHandler)(exports.io, socket);
    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});
exports.io.on("connection", onConnection);
(0, db_1.default)();
(0, redis_connect_1.redisConnect)();
//Body parser setup
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/auth", auth_1.default);
app.use("/api/users/me", user_1.default);
app.use("/api/community", community_1.default);
app.use("/api/posts", post_1.default);
app.use("/api", search_1.default);
app.use("/api/chat", chat_1.default);
app.use("/api/contact", contact_1.default);
app.use("/api/uploads", uploads_1.default);
if (process.env.NODE_ENV === "production") {
    // Serve any static files
    app.use(express_1.default.static(path_1.default.join(__dirname, "./build")));
    // Handle React routing, return all requests to React app
    app.get("*", function (req, res) {
        res.sendFile(path_1.default.join(__dirname, "./build", "index.html"));
    });
}
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
});
//Mount api routes here
httpServer.listen(process.env.PORT, () => {
    console.log(`Backend server running on ${process.env.PORT}`);
});
