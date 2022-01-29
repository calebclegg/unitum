import { schoolWork } from "../types/schoolWork";
import Joi from "joi";

export const validateSchoolWorkData = async (data: schoolWork) => {
  const schema = Joi.object<schoolWork>({
    userID: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().max(400),
    media: Joi.array().items(Joi.string()).required(),
    grade: Joi.string().required(),
    date: Joi.date()
  });
  return schema.validate(data);
};

export const validateEditSchoolWorkData = async (data: schoolWork) => {
  const schema = Joi.object<schoolWork>({
    title: Joi.string().required(),
    description: Joi.string().max(400),
    media: Joi.array().items(Joi.string()),
    grade: Joi.string().required(),
    date: Joi.date()
  });
  return schema.validate(data);
};
