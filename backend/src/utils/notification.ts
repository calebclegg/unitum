import { Notification } from "../models/Notification";
import { notification } from "../types/notification";
import { io } from "../server";

export const sendNotification = async (content: notification, to: string) => {
  try {
    const newNotification = await new Notification(content).save();
    io.to(to).emit(
      "new notification",
      newNotification.populate({
        path: "user",
        select: "profile.fullName profile.picture"
      })
    );
  } catch (e) {
    console.log(e);
  }
};
