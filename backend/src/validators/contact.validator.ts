import Joi from "joi";

export const validateContactCreateData = async (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    message: Joi.string().required().max(300)
  }).options({ abortEarly: false, allowUnknown: true });

  return schema.validate(data);
};
