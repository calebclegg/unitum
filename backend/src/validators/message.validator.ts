import Joi from "joi";
import { IMessage } from "../types/message";

export const validateMessageData = async (data: IMessage) => {
  const schema = Joi.object<IMessage>({
    from: Joi.string().required(),
    to: Joi.string().required(),
    text: Joi.string(),
    media: Joi.string(),
    chatID: Joi.string()
  }).options({ abortEarly: false });
  return schema.validate(data);
};
