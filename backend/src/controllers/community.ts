import { Response } from "express";
import {
  validateCommCreateData,
  validateCommEditData
} from "../validators/community.validator";
import CommunityModel from "../models/Community";
import { Types } from "mongoose";
import { ICommunity } from "../types/community";

export const createCommunity = async (req: any, res: Response) => {
  const user = req.user;
  const valData = await validateCommCreateData(req.body);
  if (valData.error)
    return res
      .status(400)
      .json({ message: "Some fields may be invalid / required" });
  const newCommunity = new CommunityModel({
    admin: user._id,
    ...valData.value
  });
  try {
    const savedCommunity = await newCommunity.save();
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
  });
  console.log(dbCommunity);
  if (!dbCommunity)
    return res.status(404).json({ message: "Community not found" });

  if (dbCommunity.admin.toString() !== user._id.toString())
    return res.sendStatus(403);
  const valData = await validateCommEditData(req.body);
  if (valData.error)
    return res
      .status(400)
      .json({ message: "Some fields are invalid/required" });

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      { _id: commID },
      valData.value
    );
    return res.status(200).json(updatedCommunity);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const viewCommunity = async (req: any, res: Response) => {
  const commID = new Types.ObjectId(req.params.commID);
  const dbCommunity = await CommunityModel.findById(commID).select([
    "-members"
  ]);
  if (!dbCommunity)
    return res.status(404).json({ message: "Community not found" });

  return res.status(200).json(dbCommunity);
};

export const deleteCommunity = async (req: any, res: Response) => {
  const commID = new Types.ObjectId(req.params.commID);
  const community = await CommunityModel.findById(commID);
  console.log(community);
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
  console.log(communityName);
  let communities;
  if (!communityName) {
    communities = await CommunityModel.find({}).skip(skip).limit(limit);
  } else {
    communities = await CommunityModel.find({
      $text: { $search: communityName }
    })
      .skip(skip)
      .limit(limit);
  }

  console.log(communities);
  if (!communities) return res.sendStatus(404);
  return res.status(200).json(communities);
};
