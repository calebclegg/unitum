import { Response } from "express";
import { Types } from "mongoose";
import { PostModel } from "../models/Post";
import { SavedPost } from "../models/SavedPost";

export const getSavedPosts = async (req: any, res: Response) => {
  const user = req.user;
  const db = await SavedPost.findOne({ userID: user._id })
    .select("-userID +posts")
    .populate({
      path: "posts",
      select: "-__v +upvoteBy -comments",
      populate: [
        {
          path: "author",
          select: "profile.fullName profile.picture _id email"
        },
        {
          path: "communityID",
          select: "name picture"
        }
      ]
    });
  if (!db) return res.status(200).json([]);
  let posts: any = [...db.posts];
  posts = posts.map((post: any) => {
    const upvoted = post.upvoteBy?.some((objectid: any) => {
      return objectid.equals(user._id);
    });
    delete post.upvoteBy;
    return { ...post.toObject(), upvoted: upvoted };
  });
  return res.status(200).json(posts);
};

export const saveAPost = async (req: any, res: Response) => {
  const user = req.user;
  const { postID } = req.body;

  if (!postID) return res.status(400).json({ message: "postID is required" });

  const exists = await PostModel.exists({ _id: postID });
  if (!exists) return res.status(404).json({ message: "Post does not exist" });
  let savePosts = await SavedPost.findOne({ userID: user._id });
  if (!savePosts) {
    savePosts = await new SavedPost({
      userID: user._id,
      posts: [postID]
    }).save();
  }
  const saved = savePosts.posts.some((objectId: Types.ObjectId) => {
    return objectId.equals(new Types.ObjectId(postID));
  });

  if (saved) {
    const newPosts = savePosts.posts.filter((objectid: Types.ObjectId) => {
      return objectid.toString() !== postID;
    });
    savePosts.posts = newPosts;
  } else {
    savePosts.posts.push(postID);
    console.log(savePosts);
  }
  await savePosts.save();
  return res.sendStatus(200);
};

export const unsavePost = async (req: any, res: Response) => {
  const user = req.user;
  const postID = req.params.postID;
  const savedPost = await SavedPost.findOne({ userID: user._id });
  if (!savedPost) return res.status(200).json([]);
  const posts = savedPost?.posts.filter((objectid: Types.ObjectId) => {
    return objectid.toString() !== postID.toString();
  });
  if (savedPost?.posts) savedPost.posts = posts;
  await savedPost?.save();
  return res.sendStatus(200);
};
