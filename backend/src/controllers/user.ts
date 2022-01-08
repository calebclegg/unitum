import { Request, Response } from "express";
import User from "../models/User";
import { IUSer } from "../types/user";
import { validateUserUpdate } from "../validators/user.validator";

export const userInfo = async (req: any, res: Response) => {
  const user = req.user;
  console.log(req.body);
  return res.status(200).json({ user });
};

export const updateUserInfo = async (req: any, res: Response) => {
  const user = req.user;
  const valData = await validateUserUpdate(req.body);
  if (valData.error) {
    return res
      .status(400)
      .json({ message: "Some fields are invalid / required" });
  }
  console.log(valData.value);
  const updatedUser = await User.findOneAndUpdate(
    { email: user.email },
    valData.value
  );
  console.log(updatedUser);
  return res.send("done ...");
};
