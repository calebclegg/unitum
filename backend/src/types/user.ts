import { Types } from "mongoose";

type Role = "admin" | "active";

interface IEducation {
  user: Types.ObjectId;
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
  education?: Types.ObjectId[];
  communities?: Types.ObjectId[];
  schoolWork?: Types.ObjectId[];
  unicoyn: number;
}

interface IUser {
  fullName: string;
  password?: string;
  role?: Role;
  picture?: string;
  authProvider: string;
  email?: string;
  profile?: IProfile;
  number?: number[];
  verifyPassword(password: string): boolean;
}
export { IEducation, IProfile, IUser };
