import { Schema, model } from "mongoose";
import { schoolWork } from "../types/schoolWork";

const workSchema = new Schema<schoolWork>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      max: 400,
      required: true
    },
    media: {
      type: [String],
      required: true
    },
    grade: {
      type: String,
      required: true
    },
    date: {
      type: Date
    }
  },
  { timestamps: true }
);

export const SchoolWork = model("SchoolWork", workSchema);
