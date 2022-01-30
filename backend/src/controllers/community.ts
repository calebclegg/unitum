import { Response } from "express";
import {
  validateCommCreateData,
  validateCommEditData
} from "../validators/community.validator";
import CommunityModel from "../models/Community";
import { Types } from "mongoose";
import User from "../models/User";
import { notification } from "../types/notification";
import { sendNotification } from "../utils/notification";
import { ICommunity } from "../types/community";

export const createCommunity = async (req: any, res: Response) => {
  const user = req.user;
  const valData = await validateCommCreateData(req.body);
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
  const newCommunity = new CommunityModel({
    admin: user._id,
    ...valData.value
  });
  try {
    const savedCommunity = await newCommunity.save();
    user.profile.communities.push(savedCommunity._id);
    user.save();
    return res.status(201).json(savedCommunity);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const editCommunity = async (req: any, res: Response) => {
  const user = req.user;
  const commID = new Types.ObjectId(req.params.commID);
  const dbCommunity = await CommunityModel.findById({
    _id: commID
  }).populate({ path: "admin", select: "profile.fullName" });

  if (!dbCommunity)
    return res.status(404).json({ message: "Community not found" });

  if (dbCommunity.admin.toString() !== user._id.toString())
    return res.sendStatus(403);
  const valData = await validateCommEditData(req.body);
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
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      { _id: commID },
      valData.value,
      { new: true }
    );
    res.status(200).json(updatedCommunity);
    const admin = await User.findOne({ _id: dbCommunity.admin._id }).select(
      "profile.fullName"
    );
    const notification: notification = {
      message: `${admin?.profile?.fullName} updated ${dbCommunity.name} community`,
      type: "community",
      user: dbCommunity.admin._id,
      community: dbCommunity._id
    };
    await sendNotification(req.socket, notification, dbCommunity._id);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const viewCommunity = async (req: any, res: Response) => {
  const commID = new Types.ObjectId(req.params.commID);
  const dbCommunity = await CommunityModel.findById(commID)
    .select(["-__v", "-updatedAt"])
    .populate([
      {
        path: "admin",
        select: ["profile.fullName", "email", "profile.picture"]
      },
      {
        path: "members.info",
        select:
          "-fullName -role -profile.dob -profile.communities -profile.schoolWork -profile.education -__v"
      }
    ]);
  if (!dbCommunity)
    return res.status(404).json({ message: "Community not found" });

  return res.status(200).json(dbCommunity);
};

export const deleteCommunity = async (req: any, res: Response) => {
  const commID = new Types.ObjectId(req.params.commID);
  const community = await CommunityModel.findById(commID);

  if (!community) return res.sendStatus(404);
  if (community && community._id.toString() !== req.user._id.toString())
    return res.sendStatus(403);
  try {
    await community?.delete();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const searchCommunity = async (req: any, res: Response) => {
  const communityName = req.query.search;
  const limit = req.query.limit || 10;
  const skip = req.query.offset || 0;

  let communities;
  if (!communityName) {
    communities = await CommunityModel.find({})
      .skip(skip)
      .limit(limit)
      .populate({
        path: "admin",
        select: ["profile.fullName", "email", "profile.picture"]
      })
      .select("-members -__v -updatedAt");
  } else {
    communities = await CommunityModel.find({
      $text: { $search: communityName }
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "admin",
        select: ["profile.fullName", "email", "profile.picture"]
      })
      .select("-members -__v -updatedAt");
  }

  if (!communities) return res.sendStatus(404);
  return res.status(200).json(communities);
};

export const addMember = async (req: any, res: Response) => {
  const commID = req.params.commID;
  const userID = req.body.userID;
  if (!userID) {
    return res.status(400).json({ message: "userID is required" });
  }

  const user = await User.findOne({ _id: userID });
  if (!user)
    return res.status(404).json({ message: "User with this Id not found" });

  const community = await CommunityModel.findOne({ _id: commID });
  if (!community)
    return res.status(404).json({ message: "Community not found" });

  if (community.admin.toString() !== req.user._id.toString())
    return res
      .status(401)
      .json({ message: "You are unauthorized to add user to this community" });

  const isMember = community.members?.some((member) => {
    return member?.info?.equals(userID);
  });

  if (isMember)
    return res
      .status(200)
      .json({ message: "User is already a member of this community" });

  user.profile?.communities?.push(community._id);
  community.members?.push({ info: userID, role: "member" });
  community.numberOfMembers! += 1;
  try {
    user.save();
    community.save();
    res.status(200).json({ message: "New Member has been added successfully" });

    const admin = await User.findOne({ _id: community.admin._id }).select(
      "profile.fullName"
    );
    const notification: notification = {
      message: `${admin?.profile?.fullName} added you to ${community.name}`,
      type: "community",
      user: community.admin._id,
      community: community._id,
      userID: user._id
    };
    await sendNotification(req.socket, notification, user._id);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const removeMember = async (req: any, res: Response) => {
  const commID = req.params.commID;
  const userID = req.body.userID;
  if (!userID) return res.status(400).json({ message: "userID is required" });

  const user = await User.findOne({ _id: userID });

  const community = await CommunityModel.findOne({ _id: commID });
  if (!community)
    return res.status(404).json({ message: "Community not found" });

  if (!(community.admin._id.toString() === req.user._id.toString()))
    return res.status(401).json({
      message: "You are unauthorized to remove a member from this community"
    });
  const isMember = community.members?.some((member) => {
    return member?.info?.equals(user?._id);
  });

  if (!isMember)
    return res
      .status(400)
      .json({ message: "User is not a member of this community" });

  const newMemberList = community.members?.filter((member) => {
    return member.info?.toString() !== user?._id.toString();
  });

  const newCommunityList = user?.profile?.communities?.filter((comm) => {
    return comm.toString() !== community._id.toString();
  });

  community.members = newMemberList;
  if (user?.profile?.communities) {
    user.profile.communities = newCommunityList;
  }
  try {
    community.save();
    user!.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const leaveCommunity = async (req: any, res: Response) => {
  const commID = req.params.commID;
  const userID = req.user._id;
  const user = await User.findOne({ _id: userID });

  const community = await CommunityModel.findOne({ _id: commID });
  if (!community)
    return res.status(404).json({ message: "Community not found" });

  const isMember = community.members?.some((member) => {
    console.log(member.info, user?._id);
    console.log(member);
    return member?.info?.equals(user?._id.toString());
  });

  if (!isMember)
    return res
      .status(400)
      .json({ message: "You are not a member of this community" });

  const newMemberList = community.members?.filter((member) => {
    return member.info.toString() !== user?._id.toString();
  });

  const newCommunityList = user?.profile?.communities?.filter((comm) => {
    return comm._id.toString() !== community._id.toString();
  });
  community.members = newMemberList;
  if (user?.profile?.communities) {
    user.profile.communities = newCommunityList;
  }
  try {
    community.save();
    user!.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};
