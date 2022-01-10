import { Response, NextFunction } from "express";
import { validateRegUser, validateLogUser } from "../validators/user.validator";
import User from "../models/User";
import { CustomRequest } from "../types/request";

async function validateUserRegData(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  console.log(req.body);
  const valData = validateRegUser(req.body);
  if (valData.error) {
    return res
      .status(400)
      .json({ message: "Some fields are invalid/required" });
  }
  const user = await User.findOne({ email: valData.value.email });

  if (user) {
    return res.status(409).send("User with this email already exist");
  }

  next();
}

async function validateUserLogData(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const valData = validateLogUser(req.body);
  if (valData.error) {
    return res
      .status(400)
      .json({ message: "Some fields are invalid/required" });
  }

  const user = await User.findOne({ email: valData.value.email }).select([
    "+authProvider",
    "+password"
  ]);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.authProvider !== "LOCAL")
    return res
      .status(409)
      .json({ message: "This email is associated with a another provider" });

  req.user = user;

  next();
}

export { validateUserRegData, validateUserLogData };
