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
  dob?: Date;
  education?: IEducation[];
  communities?: Types.ObjectId[];
  unicoyn: number;
}

interface IUSer {
  firstname: string;
  lastname: string;
  password?: string;
  otherNames?: string;
  role?: Role;
  authProvider: string;
  email?: string;
  profile?: IProfile;
  number?: number[];
  verifyPassword(password: string): boolean;
}
export { IEducation, IProfile, IUSer };
