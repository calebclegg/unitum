import * as Yup from "yup";

export const loginValues = {
  email: "",
  password: ""
};

export const registerValues = {
  fullName: "",
  ...loginValues
};

export type TLoginValues = typeof loginValues;
export type TRegisterValues = typeof registerValues;

export const loginSchema = Yup.object({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().min(8).required().label("Password")
});

export const registerSchema = Yup.object({
  fullName: Yup.string().required().label("Full Name"),
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().min(8).required().label("Password")
});

export type TLoginSchema = typeof loginSchema;
export type TRegisterSchema = typeof registerSchema;

export const initialContactDetails = {
  fullName: "",
  email: "",
  message: ""
};

export const contactSchema = Yup.object({
  fullName: Yup.string().required().label("Full Name"),
  email: Yup.string().email().required().label("Email"),
  message: Yup.string().required().label("Message")
});

export type TContactDetails = typeof initialContactDetails;
