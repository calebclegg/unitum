import Joi from "joi";
import { ICommunity } from "../types/community";

export const validateCommCreateData = async (data: ICommunity) => {
  const commSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().max(150),
    picture: Joi.string()
  });
  return commSchema.validate(data);
};

export const validateCommEditData = async (data: ICommunity) => {
  const commSchema = Joi.object({
    name: Joi.string().min(2).max(30),
    description: Joi.string().max(150),
    picture: Joi.string()
  });
  return commSchema.validate(data);
};
