import bcrypt from "bcryptjs";
import { profile } from "console";

const users = [
  {
    fullname: "John Barnes",
    email: "ohenesetwumasi@gmail.com",
    password: bcrypt.hashSync("jaybarnes3319", 10),
    role: "active",
    profile: {
      fullname: "John Barnes"
    }
  },
  {
    fullname: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    profile: {
      fullname: "John Doe"
    }
  },
  {
    fullname: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    profile: {
      fullname: "Jane Doe"
    }
  },
  {
    fullname: "Rex Osei",
    email: "rexosei111@gmail.com",
    password: bcrypt.hashSync("rexosei111", 10),
    profile: {
      fullname: "Rex Osei"
    }
  },
  {
    fullname: "Derek Oware",
    email: "Dchole@gmail.com",
    password: bcrypt.hashSync("Bethany", 10),
    profile: {
      fullname: "Derek Oware",
      dob: "2001-05-06",
      education: [],
      unicoyn: 21
    }
  }
];

export default users;
