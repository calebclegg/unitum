import { Request, Response } from "express";
import CommunityModel from "../models/Community";
import { PostModel } from "../models/Post";
import { SchoolWork } from "../models/schoolWork";
import User from "../models/User";
import { matchSorter } from "match-sorter";

export const search = async (req: Request, res: Response) => {
  const queryTypes = Object.keys(req.query).filter((key: string) => {
    return key !== "keyword";
  });
  const searchString = req.query.keyword;
  const dbqueries: Record<string, any> = {
    user: User.find({
      $or: [{ "profile.fullName": { $regex: searchString, $options: "i" } }]
    }).select(
      "-__v -createdAt -updatedAt -profile.education +profile.picture -profile.dob -email -fullName -role -profile.communities"
    ),
    community: CommunityModel.find({
      $or: [
        { name: { $regex: searchString, $options: "i" } },
        { description: { $regex: searchString, $options: "i" } }
      ]
    })
      .select("-__v -updatedAt -members")
      .populate({ path: "admin", select: "profile.fullName profile.picture" }),
    post: PostModel.find({
      $or: [{ body: { $regex: searchString, $options: "i" } }]
    })
      .select("-media -comments -upvoteBy -__v -updatedAt")
      .populate({ path: "author", select: "profile.fullName profile.picture" }),
    schoolWork: SchoolWork.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { description: { $regex: searchString, $options: "i" } }
      ]
    }).populate({
      path: "userID",
      select: "profile.fullName profile.picture"
    })
  };
  let types;
  if (queryTypes.length === 0) {
    types = Object.keys(dbqueries);
  } else {
    types = queryTypes;
  }
  const dbData = [];
  for (const type of types) {
    let items = await dbqueries[type];
    items = items.map((item: any) => ({
      ...item.toObject(),
      type: type
    }));
    dbData.push(...items);
  }
  matchSorter(dbData, searchString?.toString()!, {
    keys: ["profile.fullName", "name", "body", "title", "description"]
  });
  return res.status(200).json(dbData);
};
