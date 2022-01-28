import Joi from "joi";
import { IUSer } from "../types/user";

const educationSchema = Joi.array().items(
  Joi.object({
    school: Joi.object({
      name: Joi.string().required(),
      url: Joi.string()
    }),
    degree: Joi.string(),
    fieldOfStudy: Joi.string().required(),
    startDate: Joi.date().required(),
    grade: Joi.number()
  })
);

const profileSchema = Joi.object({
  fullName: Joi.string().min(2).max(20),
  picture: Joi.string(),
  dob: Joi.date(),
  education: educationSchema,
  communities: Joi.array(),
  unicoyn: Joi.number()
});

const profileUpdateSchema = Joi.object({
  fullName: Joi.string().min(2).max(20),
  picture: Joi.string(),
  dob: Joi.date()
});

function validateRegUser(data: IUSer) {
  const userSchema = Joi.object({
    fullName: Joi.string().min(2).max(20),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: profileSchema
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

export const validateUserUpdate = async (data: IUSer) => {
  const userUpdateSchema = Joi.object({
    profile: profileUpdateSchema
  }).options({ abortEarly: false });

  return userUpdateSchema.validate(data);
};

export { validateRegUser, validateLogUser, validateEmail };
