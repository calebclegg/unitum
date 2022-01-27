import { Server } from "socket.io";
import { Notification } from "../models/Notification";

export const notificationHandler = async (io: Server, socket: any) => {
  const deleteNotification = async (notificationID: string) => {
    try {
      await Notification.findOneAndDelete({ _id: notificationID });
    } catch (e) {
      console.log(e);
    }
  };

  socket.on("notification:delete", deleteNotification);
};
