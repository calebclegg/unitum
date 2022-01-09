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
