import { model, Schema, Types } from "mongoose";
import { IEducation, IProfile, IUser } from "../types/user";
import bcrypt from "bcryptjs";
import { required } from "joi";

const schoolSchema = new Schema({
  name: String,
  url: String
});

const educationSchema = new Schema<IEducation>({
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true
  // },
  school: {
    type: schoolSchema
  },
  degree: String,

  fieldOfStudy: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: Date,
  grade: {
    type: Number
  }
});
const profileSchema = new Schema<IProfile>({
  fullName: String,
  picture: String,
  dob: Date,
  education: {
    type: educationSchema,
    default: {}
  },
  communities: {
    type: [Types.ObjectId],
    ref: "Community"
  },
  followers: {
    type: [Types.ObjectId],
    ref: "User",
    default: []
  },
  followersCount: {
    type: Number,
    default: 0
  },
  following: {
    type: [Types.ObjectId],
    ref: "User",
    default: []
  },
  followingCount: {
    type: Number,
    default: 0
  },
  schoolWork: {
    type: [Types.ObjectId],
    ref: "SchoolWork"
  },
  unicoyn: {
    type: Number,
    default: 0
  }
});

const userSchema = new Schema<IUser>(
  {
    fullName: {
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

  this.profile = { fullName: this.fullName, picture: this.picture };
});

userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);
export const Education = model("Education", educationSchema);

export default User;
