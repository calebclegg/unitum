import { Request, Response } from "express";
import User from "../models/User";
import { validateUserUpdate } from "../validators/user.validator";

export const userInfo = async (req: any, res: Response) => {
  const user = req.user;
  return res.status(200).json({ user });
};

export const updateUserInfo = async (req: any, res: Response) => {
  const user = req.user;
  const valData = await validateUserUpdate(req.body);
  let errors;
  if (valData.error) {
    errors = valData.error.details.map((error) => ({
      label: error.context?.label,
      message: error.message
    }));
    return res
      .status(400)
      .json({ message: "Some fields are invalid/required", errors: errors });
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: user._id },
    valData.value,
    { new: true }
  );
  return res.send(updatedUser);
};
