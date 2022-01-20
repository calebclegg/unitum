import { Request, Response } from "express";
import { Types } from "mongoose";
import User, { Education } from "../models/User";
import {
  validateEductionData,
  validateEductionEditData,
  validateUserUpdate
} from "../validators/user.validator";

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
    { email: user.email },
    valData.value,
    { new: true }
  );
  return res.send(updatedUser);
};

export const addNewEduction = async (req: any, res: Response) => {
  const valData = await validateEductionData(req.body);
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
  try {
    const newEducation = await new Education({
      ...valData.value,
      user: req.user._id
    }).save();
    const user = await User.findOne({ _id: req.user._id });
    user?.profile?.education?.push(newEducation._id);
    await user?.save();
    return res.status(201).json(newEducation);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const editEduction = async (req: any, res: Response) => {
  const valData = validateEductionEditData(req.body);
  const edID = new Types.ObjectId(req.params.edID);
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
  try {
    const updatedEducation = await Education.findOneAndUpdate(
      { _id: edID, user: req.user._id },
      valData.value,
      { new: true }
    );
    if (!updatedEducation)
      return res.status(404).json({
        message: "Couldn't find education details tha belonged to you"
      });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteEducation = async (req: any, res: Response) => {
  const edID = new Types.ObjectId(req.params.edID);
  try {
    const edu = await Education.findOne({ _id: edID, user: req.user._id });
    if (!edu)
      return res.status(404).json({
        message: "Couldn't find education details tha belonged to you"
      });
    await edu.delete();
  } catch (error) {
    return res.sendStatus(500);
  }
};
