import { model, Schema } from "mongoose";

export interface IUSer {
  firstname: string;
  lastname: string;
  password?: string;
  otherNames?: string;
  email?: string;
}

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    otherNames: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
