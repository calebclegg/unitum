import { config as dotenv } from "dotenv-flow";
import express, { Response, NextFunction } from "express";
dotenv();
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import communityRoutes from "./routes/community";
import uploadsRoute from "./routes/uploads";
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
import { chatHandler } from "./eventHandlers/chat";
import searchRouter from "./routes/search";
import path from "path";
//dotenv conf

const wrap = (middleware: any) => (socket: Socket, next: any) =>
  middleware(socket.request, {}, next);
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*"
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

  chatHandler(io, socket);
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

io.on("connection", onConnection);

connectDB();
redisConnect();
//Body parser setup
// if (process.env.NODE_ENV === "production") {
// Serve any static files
// Handle React routing, return all requests to React app
// }
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "./build")));
//   app.get("/", function (req, res) {
//     res.sendFile(path.join(__dirname, "./build", "index.html"));
//   });
// }

//Body parser setup

app.use(express.json());

app.use(
  cors({
    origin: "*"
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users/me", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", searchRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/uploads", uploadsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./build")));
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./build", "index.html"));
  });
  app.use((err: Error, req: any, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  });
}
// Serve any static files

//Mount api routes here

httpServer.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
