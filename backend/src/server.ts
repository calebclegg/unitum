import express, { Response, NextFunction } from "express";
import { config as dotenv } from "dotenv-flow";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import communityRoutes from "./routes/community";
import postRoutes from "./routes/post";
import chatRoutes from "./routes/chat";
import contactRoutes from "./routes/contact";
import morgan from "morgan";
import connectDB from "./config/db";
import helmet from "helmet";
import cors from "cors";
import { redisConnect } from "./config/redis_connect";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getUser } from "./eventHandlers/token.middleware";
import { Notification } from "./models/Notification";
import { notificationHandler } from "./eventHandlers/notification";
import { chatHandler } from "./eventHandlers/chat";
import searchRouter from "./routes/search";
import path from "path";
//dotenv conf
dotenv();

const wrap = (middleware: any) => (socket: Socket, next: any) =>
  middleware(socket.request, {}, next);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.use(getUser);
io.use(wrap(express.json()));
const onConnection = async (socket: any) => {
  socket.join(socket.user._id.toString());
  socket.user.profile.communities.forEach((comm: string) => {
    socket.join(comm.toString());
  });

  app.use((req: any, res, next) => {
    req.io = io;
    req.socket = socket;
    next();
  });

  notificationHandler(io, socket);
  chatHandler(io, socket);
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

io.on("connection", onConnection);

connectDB();
redisConnect();

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "../../frontend/build")));
  // Handle React routing, return all requests to React app
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  });
}
//Body parser setup
app.use(express.json());

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["http://localhost:3000", "unitum.vercel.app"]
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", searchRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);

app.use((err: Error, req: any, res: Response, next: NextFunction) => {
  // console.log(err);
  res.status(500).json({ message: "Something went wrong" });
});
//Mount api routes here

httpServer.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
