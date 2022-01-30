import { Request, Response } from "express";
import { Document, Types } from "mongoose";
import { SchoolWork } from "../models/schoolWork";
import User from "../models/User";
import { IUser } from "../types/user";
import {
  validateEditSchoolWorkData,
  validateSchoolWorkData
} from "../validators/schoolWork.validator";
import { validateUserUpdate } from "../validators/user.validator";

interface IReq extends Request {
  user: Document<any, any, IUser> &
    IUser & {
      _id: Types.ObjectId;
    };
}

export const userInfo = async (req: Request, res: Response) => {
  const customRequest = req as IReq;

  try {
    const user = await User.findOne({ _id: customRequest.user._id })
      .select("-role -fullName -__v -createdAt -updatedAt")
      .populate([
        {
          path: "profile.schoolWork",
          select: "-__v -userID -updatedAt"
        },
        { path: "profile.communities", select: "-__v, -updatedAt" }
      ]);
    return res.status(200).json(user);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  const customRequest = req as IReq;
  const user = customRequest.user;
  const valData = await validateUserUpdate(customRequest.body);
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

  Object.entries(valData.value.profile).forEach(([key, value]) => {
    (user.profile as Record<string, any>)[key] = value;
  });

  await user.save();

  return res.sendStatus(200);
};

export const newSchoolWork = async (req: any, res: Response) => {
  const user = req.user;
  const valData = await validateSchoolWorkData({
    userID: user._id.toString(),
    ...req.body
  });

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
    const newWork = await new SchoolWork(valData.value).save();
    user.profile.schoolWork.push(newWork._id);
    user.profile.unicoyn += 1;
    user.save();
    return res.status(201).json(newWork);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const updateSchoolwork = async (req: any, res: Response) => {
  const user = req.user;
  const workID = req.params.workID;
  const valData = await validateEditSchoolWorkData(req.body);
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
    const work = await SchoolWork.findOneAndUpdate(
      { _id: workID, userID: user._id },
      valData.value,
      { new: true }
    );
    if (!work)
      return res.status(404).json({ message: "School work not found" });
    return res.status(200).json(work);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteSchoolwork = async (req: any, res: Response) => {
  const user = req.user;
  const workID = req.params.workID;
  try {
    const work = await SchoolWork.findOne({ _id: workID });
    if (!work)
      return res.status(404).json({ message: "School work not found" });

    if (!work.userID?.toString() !== user._id.toString())
      return res.sendStatus(401);
    work.delete();
    const newWorkIDs = user.profile.schoolWork.filter((id: Types.ObjectId) => {
      id.toString() !== workID.toString();
    });
    user.profile.shoolWork = newWorkIDs;
    if (newWorkIDs.length > 0) {
      user.profile.unicoyn -= 1;
    }
    user.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};
