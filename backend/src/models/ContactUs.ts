import { kStringMaxLength } from "buffer";
import { Schema, model } from "mongoose";
import { IContact } from "../types/contact";

const ContactSchema = new Schema<IContact>(
  {
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Contact = model("Contact", ContactSchema);
