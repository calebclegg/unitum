import bcrypt from "bcryptjs";

const users = [
  {
    fullName: "Rex Osei",
    email: "rexosei111@gmail.com",
    password: bcrypt.hashSync("rexosei111", 10),
    profile: {
      fullName: "Rex Osei",
      picture: "https://liel2c.deta.dev/images/BZN8RLvDqrQrqGgQL4GUzF.png",
      education: {
        school: {
          name: "University of Mines and Technology"
        },
        degree: "Bachelor's Degree",
        fieldOfStudy: "Computer Science and Engineering",
        startDate: "2019-09-05",
        grade: 99
      },
      communities: [],
      schoolWork: []
    }
  },
  {
    fullName: "Derek Oware",
    email: "Dchole@gmail.com",
    password: bcrypt.hashSync("testuser", 10),
    profile: {
      fullName: "Derek Oware",
      dob: "2001-05-06",
      picture: "https://liel2c.deta.dev/images/BTa8GQJQJV6VXdmFyqpDCc.png",
      education: {
        school: {
          name: "University of Mines"
        },
        degree: "Bsc. Computer Science",
        fieldOfStudy: "Computer Science",
        startDate: "2019-09-02",
        grade: 83
      },
      communities: [],
      schoolWork: [],
      unicoyn: 21
    }
  },
  {
    fullName: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    profile: {
      fullName: "John Doe",
      picture: "https://liel2c.deta.dev/images/C9n6B24XbvjKWtnbRHaQw6.jpg",
      communities: [],
      schoolWork: []
    }
  },
  {
    fullName: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    profile: {
      fullName: "Jane Doe",
      picture: "https://liel2c.deta.dev/images/BZN8RLvDqrQrqGgQL4GUzF.png",
      communities: [],
      schoolWork: []
    }
  }
];

export const education = [
  {
    school: {
      name: "University of Mines"
    },
    degree: "Bsc. Computer Science",
    fieldOfStudy: "Computer Science",
    startDate: "2019-09-02",
    grade: 83
  }
];

export default users;
