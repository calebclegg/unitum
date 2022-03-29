import Joi from "joi";
import { IEducation, IUser } from "../types/user";

const educationSchema = Joi.object({
  school: Joi.object({
    name: Joi.string().required(),
    url: Joi.string()
  }),
  degree: Joi.string(),
  fieldOfStudy: Joi.string().required(),
  startDate: Joi.date().required(),
  grade: Joi.number()
}).options({ abortEarly: false });

const educationEditSchema = Joi.object({
  school: Joi.object({
    name: Joi.string(),
    url: Joi.string()
  }),
  degree: Joi.string(),
  fieldOfStudy: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  grade: Joi.number()
}).options({ abortEarly: false });

export const validateEducationData = async (data: IEducation) => {
  return educationSchema.validate(data);
};

export const validateEducationEditData = async (data: IEducation) => {
  return educationEditSchema.validate(data);
};

const profileSchema = Joi.object({
  fullName: Joi.string().min(2).max(20),
  picture: Joi.string(),
  dob: Joi.date(),
  education: educationSchema,
  communities: Joi.array()
});

const profileUpdateSchema = Joi.object({
  fullName: Joi.string().min(2).max(20),
  picture: Joi.string(),
  dob: Joi.date(),
  education: educationEditSchema
}).options({ abortEarly: false });

function validateRegUser(data: IUser) {
  const userSchema = Joi.object({
    fullName: Joi.string().min(2).max(20),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: profileSchema
  }).options({ abortEarly: false });

  return userSchema.validate(data);
}

const validateLogUser = (data: IUser) => {
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

export const validateUserUpdate = async (data: IUser) => {
  const userUpdateSchema = Joi.object({
    profile: profileUpdateSchema
  }).options({ abortEarly: false });

  return userUpdateSchema.validate(data);
};

export { validateRegUser, validateLogUser, validateEmail };
