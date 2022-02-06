import { Request, Response } from "express";
import { Document, Types } from "mongoose";
import { SchoolWork } from "../models/schoolWork";
import User from "../models/User";
import { Education } from "../models/User";
import { IUser } from "../types/user";
import { IReq } from "../types/request";
import { Notification } from "../models/Notification";
import {
  validateEditSchoolWorkData,
  validateSchoolWorkData
} from "../validators/schoolWork.validator";
import {
  validateEducationData,
  validateEducationEditData,
  validateUserUpdate
} from "../validators/user.validator";
import { PostModel } from "../models/Post";

export const userInfo = async (req: Request, res: Response) => {
  const customRequest = req as IReq;
  const user = await User.findOne({ _id: customRequest.user._id })
    .select("-role -fullName -__v -createdAt -updatedAt")
    .populate([
      {
        path: "profile.schoolWork",
        select: "-__v -userID -updatedAt"
      },
      { path: "profile.communities", select: "-__v -updatedAt -members" }
    ]);
  return res.status(200).json(user);
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
    let field = key as string;
    if (typeof value === "object") {
      Object.entries(value as Record<string, any>).forEach(([key, value]) => {
        ((user.profile as Record<string, any>)[field] as Record<string, any>)[
          key
        ] = value;
      });
    } else {
      (user.profile as Record<string, any>)[key] = value;
    }
  });

  console.log(user);
  await user.save();

  return res.sendStatus(200);
};

// export const getEducation = async (req: any, res: Response) => {
//   const edID = req.params.edID;
//   const education = await Education.findOne({ _id: edID }).populate({
//     path: "user",
//     select:
//       "-__v -updatedAt -createdAt -role -fullName -profile.dob -profile.communities -profile.education -profile.schoolWork -profile.unicoyn"
//   });
//   if (!education)
//     return res.status(404).json({ message: "Education not found" });
//   return res.status(200).json(education);
// };

// export const addNewEducation = async (req: any, res: Response) => {
//   const valData = await validateEducationData(req.body);

//   let errors;
//   if (valData.error) {
//     errors = valData.error.details.map((error: any) => ({
//       label: error.context?.label,
//       message: error.message
//     }));
//     return res
//       .status(400)
//       .json({ message: "Some fields are invalid/required", errors: errors });
//   }
//   const newEducation = await new Education({
//     ...valData.value,
//     user: req.user._id
//   }).save();
//   const user = await User.findOne({ _id: req.user._id });
//   user?.profile?.education?.push(newEducation._id);
//   await user?.save();
//   return res.status(201).json(newEducation);
// };

// export const editEducation = async (req: any, res: Response) => {
//   const valData = await validateEducationEditData(req.body);
//   const edID = new Types.ObjectId(req.params.edID);
//   let errors;
//   if (valData.error) {
//     errors = valData.error.details.map((error: any) => ({
//       label: error.context?.label,
//       message: error.message
//     }));
//     return res
//       .status(400)
//       .json({ message: "Some fields are invalid/required", errors: errors });
//   }
//   const updatedEducation = await Education.findOneAndUpdate(
//     { _id: edID, user: req.user._id },
//     valData.value,
//     { new: true }
//   );
//   if (!updatedEducation)
//     return res.status(404).json({
//       message: "Couldn't find education details tha belonged to you"
//     });
//   return res.sendStatus(200);
// };

// export const deleteEducation = async (req: any, res: Response) => {
//   const edID = new Types.ObjectId(req.params.edID);
//   const edu = await Education.findOne({ _id: edID, user: req.user._id });
//   if (!edu)
//     return res.status(404).json({
//       message: "Couldn't find education details tha belonged to you"
//     });
//   await edu.delete();
//   return res.sendStatus(200);
// };

export const getUserSchoolWork = async (req: any, res: Response) => {
  const user = req.user;
  const works = await SchoolWork.find({ userID: user._id }).sort({
    createdAt: -1
  });
  return res.json(works);
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

  const newWork = await new SchoolWork(valData.value).save();
  user.profile.schoolWork.push(newWork._id);
  user.profile.unicoyn += 1;
  user.save();
  return res.status(201).json(newWork);
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

  const work = await SchoolWork.findOneAndUpdate(
    { _id: workID, userID: user._id },
    valData.value,
    { new: true }
  );
  if (!work) return res.status(404).json({ message: "School work not found" });
  return res.status(200).json(work);
};

export const deleteSchoolwork = async (req: any, res: Response) => {
  const user = req.user;
  const workID = req.params.workID;

  const work = await SchoolWork.findOne({ _id: workID });
  if (!work) return res.status(404).json({ message: "School work not found" });

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
};

export const getUnreadNotifications = async (req: any, res: Response) => {
  const notifications = await Notification.find({
    userID: req.user._id
  })
    .select("-__v -updatedAt")
    .populate([
      {
        path: "user",
        select: "profile.fullName profile.picture"
      },
      {
        path: "community",
        select: "name"
      },
      {
        path: "post",
        select: "body"
      }
    ])
    .sort({ createdAt: -1 });
  return res.status(200).json(notifications);
};

export const deleteNotification = async (req: any, res: Response) => {
  const user = req.user;
  const notificationIDs = req.query.notIDs;

  if (Array.isArray(notificationIDs)) {
    await Notification.findByIdAndDelete({
      _id: { $in: notificationIDs },
      userID: user._id
    });
  } else {
    await Notification.findByIdAndDelete({
      _id: notificationIDs,
      userID: user._id
    });
  }
  return res.sendStatus(200);
};

export const getUserPosts = async (req: any, res: Response) => {
  const limit = +req.query.limit || 10;
  const skip = +req.query.skip || 0;

  const posts = await PostModel.find({ author: req.user._id })
    .sort("createdAt")
    .select("-comments -upvoteBy -downVoteBy -author")
    .populate([{ path: "communityID", select: "-__v -members" }])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  return res.json(posts);
};

export const getUserCommunities = async (req: any, res: Response) => {
  const user = await User.findOne({ _id: req.user._id }).populate({
    path: "profile.communities",
    select: "-__v -members",
    populate: {
      path: "admin",
      select: "profile.fullName profile.picture"
    }
  });
  const communities = user.profile?.communities;
  return res.json(communities);
};
