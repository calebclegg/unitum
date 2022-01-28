import { Notification } from "../models/Notification";
import { notification } from "../types/notification";

export const sendNotification = async (
  socket: any,
  content: notification,
  to: string
) => {
  try {
    const newNotification = await new Notification(content).save();
    socket.to(to).emit(
      "new notification",
      newNotification.populate({
        path: "user",
        select: "profile.fullName -profile.picture -__v -updatedAt"
      })
    );
  } catch (e) {
    console.log("An error occurred");
  }
};
