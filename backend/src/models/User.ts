import { model, Schema, Types } from "mongoose";
import { IEducation, IProfile, IUSer } from "../types/user";

const schoolSchema = new Schema({
  name: String,
  url: String
})

const educationSchema = new Schema<IEducation>({
  school: {
    type: schoolSchema,
    required: true
  },
  degree: String,

  fieldOfStudy: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  grade: {
    type: Number,
  }

})
const profileSchema = new Schema<IProfile>({
  dob: Date,
  education: educationSchema,
  communities: {
    type: [Types.ObjectId],
    ref: "Community"
  },
  unicoyn: Number
})

const userSchema = new Schema<IUSer>(
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
    profile: {
      type: profileSchema
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
