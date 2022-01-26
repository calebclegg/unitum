import { model, Schema, Types } from "mongoose";
import { IEducation, IProfile, IUSer } from "../types/user";
import bcrypt from "bcryptjs";
import { string } from "joi";

const schoolSchema = new Schema({
  name: String,
  url: String
});

const educationSchema = new Schema<IEducation>({
  school: {
    type: schoolSchema,
    required: true
  },
  degree: String,

  fieldOfStudy: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  grade: {
    type: Number
  }
});
const profileSchema = new Schema<IProfile>({
  fullname: String,
  picture: String,
  dob: Date,
  education: [educationSchema],
  communities: {
    type: [Types.ObjectId],
    ref: "Community"
  },
  unicoyn: Number
});

const userSchema = new Schema<IUSer>(
  {
    fullname: {
      type: String
    },
    password: {
      type: String,
      select: false
    },
    email: {
      type: String,
      unique: true
    },
    picture: String,
    authProvider: {
      type: String,
      enum: ["LOCAL", "GOOGLE", "FACEBOOK", "TWITTER"],
      default: "LOCAL",
      required: false,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "active"],
      default: "active",
      required: false
    },
    profile: {
      type: profileSchema
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.profile = { fullname: this.fullname, picture: this.picture };
});

userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);

export default User;
