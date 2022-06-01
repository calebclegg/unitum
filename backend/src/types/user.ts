import { Types } from "mongoose";

type Role = "admin" | "active";

interface IEducation {
  school: {
    name: string;
    url?: string;
  };
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
  grade: number;
}

interface IProfile {
  fullName?: string;
  picture?: string;
  dob?: Date;
  education?: IEducation;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  followingCount: number;
  followersCount: number;
  communities?: Types.ObjectId[];
  schoolWork?: Types.ObjectId[];
  unicoyn: number;
}

interface IUser {
  _id?: Types.ObjectId;
  fullName: string;
  password?: string;
  role?: Role;
  picture?: string;
  authProvider: string;
  email?: string;
  profile: IProfile;
  number?: number[];
  verifyPassword(password: string): boolean;
}
export { IEducation, IProfile, IUser };
