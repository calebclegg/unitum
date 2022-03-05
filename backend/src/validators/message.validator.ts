import Joi from "joi";
import { IMessage } from "../types/message";

export const validateMessageData = async (data: IMessage) => {
  const schema = Joi.object<IMessage>({
    text: Joi.string(),
    media: Joi.string()
  }).options({ abortEarly: false });
  return schema.validate(data);
};

export const validateNewChat = async (data: any) => {
  const schema = Joi.object({
    to: Joi.string().required(),
    text: Joi.string(),
    media: Joi.string()
  }).options({ abortEarly: false });
  return schema.validate(data);
};
