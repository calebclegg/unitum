import { Types } from "mongoose"

interface IEducation {
    school: {
        name: string,
        url?: string
    }
    degree: string,
    fieldOfStudy: string,
    startDate: Date,
    endDate: Date,
    grade: number,
}

interface IProfile {
    dob?: Date,
    education?: IEducation,
    communities?: Types.ObjectId[],
    unicoyn: number,
}

interface IUSer {
    firstname: string;
    lastname: string;
    password?: string;
    otherNames?: string;
    email?: string;
    profile?: IProfile
}
export { IEducation, IProfile, IUSer }