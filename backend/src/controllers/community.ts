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
import { JoinCommunity } from "../models/CommRequest";
import { PostModel } from "../models/Post";
import { JoinRequest } from "../types/joinCommunity";

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
    ...valData.value,
    members: [
      {
        info: user._id,
        role: "admin"
      }
    ],
    numberOfMembers: 1
  });
  const savedCommunity = await newCommunity.save();
  user.profile.communities.push(savedCommunity._id);
  await user.save();
  return res.status(201).json(savedCommunity);
};

export const editCommunity = async (req: any, res: Response) => {
  const user = req.user;
  const commID = new Types.ObjectId(req.params.commID);
  const dbCommunity = await CommunityModel.findById({
    _id: commID
  });

  if (!dbCommunity)
    return res.status(404).json({ message: "Community not found" });

  if (dbCommunity.admin.toString() !== user._id.toString())
    return res.sendStatus(401);
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
  await sendNotification(notification, dbCommunity._id);
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

  const communityPostCount = await PostModel.find({
    communityID: dbCommunity._id
  }).count();

  return res
    .status(200)
    .json({ ...dbCommunity.toObject(), postCount: communityPostCount });
};

export const deleteCommunity = async (req: any, res: Response) => {
  const commID = new Types.ObjectId(req.params.commID);
  const community = await CommunityModel.findById(commID);

  if (!community) return res.sendStatus(404);
  if (community.admin.toString() !== req.user._id.toString())
    return res.sendStatus(403);
  await community?.delete();
  return res.sendStatus(200);
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

export const getCommunityMembers = async (req: any, res: Response) => {
  const communityID = req.params.commID;
  const limit = +req.query.limit || 20;
  const skip = +req.query.skip || 0;

  const dbCommunity = await CommunityModel.findById(communityID)
    .select(["-__v", "-updatedAt"])
    .populate([
      {
        path: "members.info",
        select: "profile.fullName profile.picture"
      }
    ]);

  if (!dbCommunity)
    return res.status(404).json({ message: "Community not found" });

  const memebers = dbCommunity.members?.slice(skip, skip + limit);
  return res.json(memebers);
};

export const addMember = async (req: any, res: Response) => {
  const commID = req.params.commID;
  const requestID = req.body.requestID;
  const action: "accept" | "reject" = req.query.action;
  if (!requestID) {
    return res.status(400).json({ message: "requestID is required" });
  }

  if (action === "reject") {
    await JoinCommunity.findOneAndDelete({ _id: requestID });
    return res.sendStatus(200);
  }
  const request: JoinRequest = await JoinCommunity.findOne({
    _id: requestID
  }).populate({
    path: "community",
    select: "name admin"
  });
  if (!request)
    return res.status(404).json({ message: "request with this Id not found" });

  const community = await CommunityModel.findOne({ _id: commID });
  if (!community)
    return res.status(404).json({ message: "Community not found" });

  if (request.community.admin.toString() !== req.user._id.toString())
    return res.status(401).json({
      message: "You are unauthorized to add user to this community"
    });

  const isMember = community.members?.some((member) => {
    return member?.info?.equals(requestID);
  });

  if (isMember)
    return res
      .status(200)
      .json({ message: "User is already a member of this community" });

  const user = await User.findById(request.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.profile?.communities?.push(community._id);
  community.members?.push({ info: requestID, role: "member" });
  community.numberOfMembers! += 1;
  user.save();
  community.save();

  await request.delete();
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
  await sendNotification(notification, user._id);
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
  community.save();
  user?.save();
  return res.sendStatus(200);
};

export const leaveCommunity = async (req: any, res: Response) => {
  const commID = req.params.commID;
  const userID = req.user._id;
  const user = await User.findOne({ _id: userID });

  const community = await CommunityModel.findOne({ _id: commID });
  if (!community)
    return res.status(404).json({ message: "Community not found" });

  if (community.admin.toString() === userID.toString())
    return res.status(403).json({ message: "You cannot leave this community" });
  const isMember = community.members?.some((member) => {
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
  community.save();
  user?.save();
  return res.sendStatus(200);
};

export const getJoinRequests = async (req: any, res: Response) => {
  const user = req.user;
  const commID = req.params.commID;
  const community = await CommunityModel.findOne({ _id: commID });
  if (!community)
    return res.status(404).json({ message: "Community not found" });

  if (community.admin.toString() !== user._id.toString()) {
    return res.status(401).json({ message: "You are unauthorized" });
  }

  const requests = await JoinCommunity.find({ community: commID }).populate([
    { path: "community", select: "name picture description" },
    { path: "user", select: "profile.fullName profile.picture" }
  ]);
  console.log(requests);
  return res.json(requests);
};

export const joinCommunity = async (req: any, res: Response) => {
  const user = req.user;
  const commID = req.params.commID;

  const community = await CommunityModel.findOne({ _id: commID });
  if (!community)
    return res.status(404).json({ message: "Community not found" });
  const isMember = community.members?.some((member) => {
    return member?.info?.equals(user?._id);
  });

  if (isMember)
    return res
      .status(200)
      .json({ message: "You are member of this community" });

  await new JoinCommunity({
    community: community._id,
    user: user._id
  }).save();
  return res.sendStatus(200);
};

export const getOtherCommunities = async (req: any, res: Response) => {
  const user = req.user;
};
