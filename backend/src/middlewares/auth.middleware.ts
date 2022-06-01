import { Response, NextFunction } from "express";
import { validateRegUser, validateLogUser } from "../validators/user.validator";
import User from "../models/User";

async function validateUserRegData(
  req: any,
  res: Response,
  next: NextFunction
) {
  const valData = validateRegUser(req.body);
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
  const user = await User.findOne({ email: valData.value.email });

  if (user) {
    return res.status(409).send("User with this email already exist");
  }

  next();
}

async function validateUserLogData(
  req: any,
  res: Response,
  next: NextFunction
) {
  const valData = validateLogUser(req.body);
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
