import { DataStoredInToken, TokenData } from "../types/token";
import { IUSer } from "../types/user";
const jwt = require("jsonwebtoken");

const createToken = async function name(user: IUSer) {
  const expiresIn = process.env.JWT_EXPIRE_TIME;
  const secret = process.env.JWT_SECRET;
  const dataStoredInToken: DataStoredInToken = {
    email: user.email!
  };
  const token = jwt.sign(dataStoredInToken, secret, { expiresIn });
  return {
    expiresIn: +expiresIn!,
    token: token
  };
};

export { createToken };
