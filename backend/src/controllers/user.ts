import { Request, Response } from "express";
import { Document, Types } from "mongoose";
import { SchoolWork } from "../models/schoolWork";
import User from "../models/User";

import { IUser, IEducation } from "../types/user";
import { IReq } from "../types/request";
import { Notification } from "../models/Notification";
import {
  validateEditSchoolWorkData,
  validateSchoolWorkData
} from "../validators/schoolWork.validator";
import {
  validateEducationEditData,
  validateUserUpdate
} from "../validators/user.validator";
import { PostModel } from "../models/Post";
import { SavedPost } from "../models/SavedPost";

export const userInfo = async (req: Request, res: Response) => {
  const customRequest = req as IReq;
  const user = await User.findOne({ _id: customRequest.user._id })
    .select("-role -fullName -__v -createdAt -updatedAt")
    .populate([
      {
        path: "profile.schoolWork",
        select: "-__v -userID -updatedAt"
      },
      { path: "profile.communities", select: "-__v -updatedAt -members" },
      { path: "profile.followers", select: "fullname picture" },
      { path: "profile.following", select: "fullname picture" }
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
    const field = key as string;
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

export const unfollowUser = async (req: any, res: Response) => {
  const userID = req.params.userID;
  console.log(userID);
  const user = await User.findOne({ id: userID });
  if (!user) return res.status(404).json({ message: "User not found" });
  const following = user.profile?.followers?.some((id: Types.ObjectId) => {
    return id.equals(req.user._id);
  });
  if (!following) return res.sendStatus(200);
  const newFollowersList = user.profile.followers?.filter(
    (id: Types.ObjectId) => {
      return id.toString() !== req.user._id.toString();
    }
  );
  user.profile.followers = newFollowersList;
  user.profile.followersCount = newFollowersList.length;
  user.save();
  const user1 = req.user;
  const newFollowingList = user1.profile.following?.filter(
    (id: Types.ObjectId) => {
      return id.toString() !== user?._id.toString();
    }
  );
  user1.profile.followingCount = newFollowingList.length;
  user1.save();
  return res.sendStatus(200);
};

export const followUser = async (req: any, res: Response) => {
  const userID = req.params.userID;
  console.log(userID);

  const user = await User.findOne({ id: userID });
  if (!user) return res.status(404).json({ message: "User not found" });
  const following = user.profile?.followers?.some((id: Types.ObjectId) => {
    return id.equals(req.user._id);
  });
  if (following) return res.sendStatus(200);
  user.profile?.followers?.push(req.user._id);
  user.profile.followersCount += 1;
  user.save();
  const user1 = req.user;
  user1.profile.following.push(user._id);
  user1.profile.followingCount += 1;
  user1.save();
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

export const editEducation = async (req: any, res: Response) => {
  const user = req.user;
  console.log(req.body);
  const valData = await validateEducationEditData(req.body);
  console.log(valData.value);
  let errors;

  if (!user?.profile?.education) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user.profile.education! = {
      school: {
        name: "",
        url: ""
      },
      degree: "",
      fieldOfStudy: "",
      startDate: new Date(),
      endDate: new Date(),
      grade: 0
    };
  }
  if (valData.error) {
    errors = valData.error.details.map((error: any) => ({
      label: error.context?.label,
      message: error.message
    }));
    return res
      .status(400)
      .json({ message: "Some fields are invalid/required", errors: errors });
  }

  Object.entries(valData.value).forEach(([key, value]) => {
    const field = key as string;
    if (typeof value === "object") {
      Object.entries(value as Record<string, any>).forEach(([key, value]) => {
        (
          (user.profile?.education as Record<string, any>)[field] as Record<
            string,
            any
          >
        )[key] = value;
      });
    } else {
      (user.profile?.education as Record<string, any>)[key] = value;
    }
  });

  console.log(user);
  await user.save();

  return res.sendStatus(200);
};

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
  const works = await SchoolWork.find({ userID: user._id })
    .sort({
      createdAt: -1
    })
    .populate({ path: "userID", select: "profile.fullName profile.picture" });
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
  const notificationID = req.params.notID;
  await Notification.findByIdAndDelete({
    _id: notificationID,
    userID: user._id
  });

  return res.sendStatus(200);
};

export const markAllAsRead = async (req: any, res: Response) => {
  const user = req.user;
  await Notification.deleteMany({ userID: user._id });
  return res.sendStatus(200);
};

export const getUserPosts = async (req: any, res: Response) => {
  const limit = +req.query.limit || 10;
  const skip = +req.query.skip || 0;

  const dbposts = await PostModel.find({ author: req.user._id })
    .sort("createdAt")
    .select("-comments")
    .populate([
      { path: "communityID", select: "-__v -members" },
      { path: "author", select: "profile.fullName profile.picture" }
    ])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const savedPosts = await SavedPost.findOne({ userID: req.user._id });
  const posts = dbposts.map((post: any) => {
    const upvoted = post.upvoteBy?.some((objectid: any) => {
      return objectid.equals(req.user._id);
    });

    const downvoted = post.downVoteBy?.some((objectid: any) => {
      return objectid.equals(req.user._id);
    });

    let saved = false;
    if (savedPosts) {
      saved = savedPosts.posts.some((objectid: Types.ObjectId) => {
        return objectid.equals(post._id);
      });
    }
    post = {
      ...post.toObject(),
      saved: saved,
      upvoted: upvoted,
      downvoted: downvoted
    };
    delete post.upvoteBy;
    delete post.downVoteBy;
    return post;
  });
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
