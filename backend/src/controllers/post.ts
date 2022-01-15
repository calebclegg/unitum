import { Response } from "express";
import { Types } from "mongoose";
import { PostModel } from "../models/Post";
import {
  validatePostCreateData,
  validatePostEditData
} from "../validators/post.validator";

// create a post
export const createPost = async (req: any, res: Response) => {
  const user = req.user;
  const valData = await validatePostCreateData(req.body);
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
    const newPost = await new PostModel({
      ...valData.value,
      author: user._id
    }).save();
    return res.status(201).json(newPost);
  } catch (error) {
    return res.sendStatus(500);
  }
};

// get posts
export const getPosts = async (req: any, res: Response) => {
  const user = req.user;
  const communityID = req.query.communityID || null;
  const skip = req.query.skip || 0;
  const limit = req.query.limit || 20;

  let dbPosts;
  try {
    if (communityID) {
      dbPosts = await PostModel.find({ communityID: communityID })
        .sort("createdAt")
        .select("-comments")
        .populate({ path: "author", select: "profile.fullname" })
        .skip(skip)
        .limit(limit);
    } else {
      dbPosts = await PostModel.find({})
        .sort("createdAt")
        .select("-comments")
        .populate({ path: "author", select: "profile.fullname" })
        .skip(skip)
        .limit(limit);
    }
    return res.status(200).json(dbPosts);
  } catch (error) {
    return res.sendStatus(500);
  }
};

// get post details
export const getPostDetails = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  try {
    const post = await PostModel.findOne({ _id: postID }).populate({
      path: "author",
      select: "profile.fullname",
      options: { limit: 20 }
    });
    if (!post) return res.sendStatus(404);
    return res.status(200).json(post);
  } catch (error) {
    return res.sendStatus(500);
  }
};

// delete a post
export const deletePost = async (req: any, res: Response) => {
  const user = req.user;
  const postID = new Types.ObjectId(req.params.postID);
  let post;
  try {
    post = await PostModel.findOne({ _id: postID });
  } catch (error) {
    return res.sendStatus(500);
  }
  if (!post) return res.sendStatus(404);
  if (post?.author.toString() !== user._id.toString())
    return res.sendStatus(401);
  post?.delete();
  return res.sendStatus(200);
};

// update a post
export const updatePost = async (req: any, res: Response) => {
  const user = req.user;
  const postID = new Types.ObjectId(req.params.postID);
  const valData = await validatePostEditData(req.body);
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
    const post = await PostModel.findOne({ _id: postID });
    if (!post) return res.sendStatus(404);

    if (post?.author.toString() !== user._id.toString())
      return res.sendStatus(401);
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postID },
      valData.value
    );
    if (!updatedPost) return res.sendStatus(404);
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.sendStatus(500);
  }
};
