import Joi from "joi";
import { IUSer } from "../types/user";

function validateRegUser(data: IUSer) {
  const userSchema = Joi.object({
    firstname: Joi.string().min(2).max(20).required(),
    lastname: Joi.string().min(2).max(20).required(),
    otherNames: Joi.string().min(2).max(20),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }).options({ abortEarly: false });

  return userSchema.validate(data);
}

const validateLogUser = (data: IUSer) => {
  const UserSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  }).options({ abortEarly: false });

  return UserSchema.validate(data);
};

const validateEmail = (data: { email: string }) => {
  const EmailSchema = Joi.object({
    email: Joi.string().min(6).required().email()
  });
  return EmailSchema.validate(data);
};

export { validateRegUser, validateLogUser, validateEmail };
