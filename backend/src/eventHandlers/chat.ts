import { Server } from "socket.io";
import { Chat, Message } from "../models/Chat";
import { Notification } from "../models/Notification";
import { IMessage } from "../types/message";
import { notification } from "../types/notification";
import { validateMessageData } from "../validators/message.validator";

export const chatHandler = async (io: Server, socket: any) => {
  const sendMessage = async (message: IMessage) => {
    const valData = await validateMessageData(message);
    let errors;
    if (valData.error) {
      errors = valData.error.details.map((error) => ({
        label: error.context?.label,
        message: error.message
      }));
      console.log(errors);
    }
    if (!(valData?.value?.text && valData?.value?.text)) {
      console.log("message has neither text nor media..");
    }
    try {
      const message = await new Message(valData.value).save();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChat = async (chatID: string) => {
    try {
      await Chat.findOneAndDelete({ _id: chatID });
    } catch (e) {
      console.log(e);
    }
  };
  socket.on("message:send", sendMessage);
};
