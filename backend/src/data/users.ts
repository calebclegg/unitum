import bcrypt from "bcryptjs";
import { profile } from "console";

const users = [
  {
    fullName: "John Barnes",
    email: "ohenesetwumasi@gmail.com",
    password: bcrypt.hashSync("jaybarnes3319", 10),
    role: "active",
    profile: {
      fullName: "John Barnes"
    }
  },
  {
    fullName: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    profile: {
      fullName: "John Doe"
    }
  },
  {
    fullName: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    profile: {
      fullName: "Jane Doe"
    }
  },
  {
    fullName: "Rex Osei",
    email: "rexosei111@gmail.com",
    password: bcrypt.hashSync("rexosei111", 10),
    profile: {
      fullName: "Rex Osei"
    }
  },
  {
    fullName: "Derek Oware",
    email: "Dchole@gmail.com",
    password: bcrypt.hashSync("Bethany", 10),
    profile: {
      fullName: "Derek Oware",
      dob: "2001-05-06",
      education: [
        {
          school: {
            name: "University of Mines"
          },
          degree: "Bsc. Computer Science",
          fieldOfStudy: "Computer Science",
          startDate: "2019-09-02",
          grade: 83
        }
      ],
      unicoyn: 21
    }
  }
];

export default users;
