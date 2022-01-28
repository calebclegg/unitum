import { Request, Response } from "express";
import CommunityModel from "../models/Community";
import { PostModel } from "../models/Post";
import { SchoolWork } from "../models/schoolWork";
import User from "../models/User";

export const search = async (req: Request, res: Response) => {
  const type = req.query.type || undefined;
  const searchString = req.query.search;
  const dbqueries: Record<string, any> = {
    user: User.find({
      $or: [{ "profile.fullName": { $regex: searchString, $options: "i" } }]
    }).select(
      "-__v -createdAt -updatedAt -profile.education +profile.picture -profile.dob -email -fullName -role -profile.communities"
    ),
    community: CommunityModel.find({
      $or: [{ name: { $regex: searchString, $options: "i" } }]
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
      select:
        "-__v -updatedAt -email - role -fullName -profile.dob -profile.communities -profile.schoolWork -profile.education"
    })
  };
  try {
    let dbquery, data: any;
    if (type) {
      dbquery = dbqueries[type.toString()];
      data = await dbquery;
    } else {
      const types = Object.keys(dbqueries);
      data = {};
      for (const type of types) {
        const items = await dbqueries[type];
        data[type] = items;
      }
      console.log(data);
    }

    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
