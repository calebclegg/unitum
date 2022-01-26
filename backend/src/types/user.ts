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
  fullname?: string;
  picture?: string;
  dob?: Date;
  education?: IEducation[];
  communities?: Types.ObjectId[];
  unicoyn: number;
}

interface IUSer {
  fullname: string;
  password?: string;
  role?: Role;
  picture?: string;
  authProvider: string;
  email?: string;
  profile?: IProfile;
  number?: number[];
  verifyPassword(password: string): boolean;
}
export { IEducation, IProfile, IUSer };
