"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.education = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users = [
    {
        fullName: "John Barnes",
        email: "ohenesetwumasi@gmail.com",
        password: bcryptjs_1.default.hashSync("jaybarnes3319", 10),
        role: "active",
        profile: {
            picture: "https://liel2c.deta.dev/images/2CqdBMbBaKkxJFv5kzDkHQ.jpeg",
            fullName: "John Barnes",
            education: new Array(),
            communities: new Array(),
            schoolWork: new Array()
        }
    },
    {
        fullName: "John Doe",
        email: "john@example.com",
        password: bcryptjs_1.default.hashSync("123456", 10),
        profile: {
            fullName: "John Doe",
            picture: "https://liel2c.deta.dev/images/C9n6B24XbvjKWtnbRHaQw6.jpg",
            education: new Array(),
            communities: new Array(),
            schoolWork: new Array()
        }
    },
    {
        fullName: "Jane Doe",
        email: "jane@example.com",
        password: bcryptjs_1.default.hashSync("123456", 10),
        profile: {
            fullName: "Jane Doe",
            picture: "https://liel2c.deta.dev/images/BZN8RLvDqrQrqGgQL4GUzF.png",
            education: new Array(),
            communities: new Array(),
            schoolWork: new Array()
        }
    },
    {
        fullName: "Rex Osei",
        email: "rexosei111@gmail.com",
        password: bcryptjs_1.default.hashSync("rexosei111", 10),
        profile: {
            fullName: "Rex Osei",
            picture: "https://liel2c.deta.dev/images/BZN8RLvDqrQrqGgQL4GUzF.png",
            education: new Array(),
            communities: new Array(),
            schoolWork: new Array()
        }
    },
    {
        fullName: "Derek Oware",
        email: "Dchole@gmail.com",
        password: bcryptjs_1.default.hashSync("testuser", 10),
        profile: {
            fullName: "Derek Oware",
            dob: "2001-05-06",
            picture: "https://liel2c.deta.dev/images/BTa8GQJQJV6VXdmFyqpDCc.png",
            education: new Array(),
            communities: new Array(),
            schoolWork: new Array(),
            unicoyn: 21
        }
    }
];
exports.education = [
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
exports.default = users;
