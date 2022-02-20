import { Notification } from "../models/Notification";
import { notification } from "../types/notification";
import { Server } from "socket.io";

export const sendNotification = async (
  io: Server,
  content: notification,
  to: string
) => {
  const newNotification = await new Notification(content).save();
  io.to(to).emit(
    "new notification",
    newNotification.populate({
      path: "user",
      select: "profile.fullName -profile.picture -__v -updatedAt"
    })
  );
};
