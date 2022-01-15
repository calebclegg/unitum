import bcrypt from "bcryptjs";

const users = [
  {
    fullname: "John Barnes",
    email: "ohenesetwumasi@gmail.com",
    password: bcrypt.hashSync("jaybarnes3319", 10),
    role: "active"
  },
  {
    fullname: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    fullname: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
      fullname: "Rex Osei",
      email: "rexosei111@gmail.com",
      password: bcrypt.hashSync("rexosei111", 10)
  },
  {
    fullname: "Derek Oware",
    email: "Dchole@gmail.com",
    password: bcrypt.hashSync("Bethany", 10),
    profile: {
        dob: "2001-05-06",
        education: [{
            school: {
                name: "University of Mines"
            },
            degree: "Bsc. Computer Science",
            fieldOfStudy: "Computer Science",
            startDate: "2019-09-02",
            grade: 83
        }],
        unicoyn: 21

    }
  }
];

export default users;