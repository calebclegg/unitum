import { Types } from "mongoose";

export interface IEducation {
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

export interface IProfile {
  dob?: Date;
  education?: IEducation;
  communities?: Types.ObjectId[];
  unicoyn: number;
}

export interface IUSer {
  firstname: string;
  lastname: string;
  password?: string;
  otherNames?: string;
  email?: string;
  profile?: IProfile;
}
