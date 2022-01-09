import { model, Schema, Types } from "mongoose";
import { IEducation, IProfile, IUSer } from "../types/user";
import bcrypt from "bcryptjs";

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
  dob: Date,
  education: educationSchema,
  communities: {
    type: [Types.ObjectId],
    ref: "Community"
  },
  unicoyn: Number
});

const userSchema = new Schema<IUSer>(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      select: false
    },
    email: {
      type: String,
      unique: true
    },
    otherNames: {
      type: String
    },
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
});

userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);

export default User;
