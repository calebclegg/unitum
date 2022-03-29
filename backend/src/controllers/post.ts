/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Response } from "express";
import { Types } from "mongoose";
import CommunityModel from "../models/Community";
import { CommentModel, PostModel } from "../models/Post";
import { SavedPost } from "../models/SavedPost";
import User from "../models/User";
import { notification } from "../types/notification";
import { IPost } from "../types/post";
import { sendNotification } from "../utils/notification";
import {
  validateCommentCreateData,
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
  let community;
  if (valData.value.communityID) {
    community = await CommunityModel.findOne({
      _id: valData.value.communityID
    });
    if (!community)
      return res.status(404).json({ message: "Community not found" });
  }
  const newPost = await new PostModel({
    ...valData.value,
    author: user._id
  }).save();
  const post = {
    ...newPost.toObject(),
    author: {
      profile: {
        fullName: user.profile.fullName,
        picture: user.profile.picture
      }
    }
  };
  delete post.upvoteBy;
  delete post.downVoteBy;
  delete post.nextCoyn;
  res.status(201).json(post);
  if (community) {
    const notificationInfo: notification = {
      message: `${req.user.profile.fullName} added a new post in ${community.name}`,
      type: "post",
      user: user._id,
      post: newPost._id
    };
    await sendNotification(notificationInfo, community._id.toString());
  }
};

// get posts
export const getPosts = async (req: any, res: Response) => {
  const user = req.user;
  const communityID = req.query.communityID || null;
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 20;

  let dbPosts;
  if (communityID) {
    dbPosts = await PostModel.find({ communityID: communityID })
      .sort("createdAt")
      .select("-comments +upvoteBy")
      .populate([
        { path: "author", select: "profile.fullName profile.picture" },
        { path: "communityID", select: "-__v" }
      ])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  } else {
    dbPosts = await PostModel.find({})
      .sort("createdAt")
      .select("-comments +upvoteBy")
      .populate([
        { path: "author", select: "profile.fullName profile.picture" },
        { path: "communityID", select: "-__v" }
      ])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
  const savedPosts = await SavedPost.findOne({ userID: user._id });
  const posts = dbPosts.map((post: any) => {
    const upvoted = post.upvoteBy?.some((objectid: any) => {
      return objectid.equals(user._id);
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
      upvoted: upvoted,
      downvoted: downvoted,
      saved: saved
    };
    delete post.upvoteBy;
    delete post.downVoteBy;
    return post;
  });
  const commPosts = posts.filter((post: IPost) => {
    if (post.communityID) {
      const inc = user.profile.communities.some((commID: Types.ObjectId) => {
        return commID.equals(post.communityID._id);
      });
      if (inc) return post;
    } else if (!post.communityID) {
      return post;
    }
    return;
  });

  // const wallPosts = posts.filter((post: IPost) => {
  //   if (!post.communityID) return post;
  // });

  return res.status(200).json([...commPosts]);
};

// get post details
export const getPostDetails = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  let post: any = await PostModel.findOne({ _id: postID }).populate([
    {
      path: "author",
      select: "profile.fullName profile.picture"
    },
    {
      path: "comments",
      select: "-__v",
      populate: {
        path: "author",
        select: "profile.fullName profile.picture"
      }
    },
    { path: "communityID", select: "-__v -members" }
  ]);
  if (!post) return res.sendStatus(404);
  const savedPosts = await SavedPost.findOne({ userID: req.user._id });
  let saved = false;
  if (savedPosts) {
    saved = savedPosts.posts.some((objectid: Types.ObjectId) => {
      return objectid.equals(post._id);
    });
  }
  const upvoted = post.upvoteBy?.some((objectid: any) => {
    return objectid.equals(req.user._id);
  });

  const downvoted = post.downVoteBy?.some((objectid: any) => {
    return objectid.equals(req.user._id);
  });
  post = {
    ...post.toObject(),
    upvoted: upvoted,
    downvoted: downvoted,
    saved: saved
  };
  delete post.upvoteBy;
  delete post.downVoteBy;
  return res.status(200).json(post);
};

// delete a post
export const deletePost = async (req: any, res: Response) => {
  const user = req.user;
  const postID = new Types.ObjectId(req.params.postID);

  const post = await PostModel.findOne({ _id: postID });
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
  const post = await PostModel.findOne({ _id: postID });
  if (!post) return res.sendStatus(404);

  if (post?.author.toString() !== user._id.toString())
    return res.sendStatus(401);
  const updatedPost = await PostModel.findOneAndUpdate(
    { _id: postID },
    valData.value
  ).select("-upvoteBy -downVoteBy");
  if (!updatedPost) return res.sendStatus(404);
  return res.status(200).json(updatedPost);
};

export const getPostComments = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  const limit = req.query.limit || 20;
  const skip = req.query.skip || 0;
  const comments = await CommentModel.find({ postID: postID })
    .skip(skip)
    .limit(limit)
    .select(["-__v"])
    .populate({
      path: "author",
      select: "profile.fullName profile.picture"
    });
  return res.status(200).json(comments);
};

export const addPostComment = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  const valData = await validateCommentCreateData(req.body);
  const post = await PostModel.findOne({ _id: postID });
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.communityID) {
    const userCommunities = req.user.profile.communities.map(
      (commID: Types.ObjectId) => {
        return commID.toString();
      }
    );
    if (!userCommunities.includes(post.communityID.toString()))
      return res.status(401).json({ message: "Cannot comment on this post" });
  }

  let errors;
  if (valData.error) {
    errors = valData.error.details?.map((error) => ({
      label: error.context?.label,
      message: error.message
    }));
    return res
      .status(400)
      .json({ message: "Some fields are invalid/required", errors: errors });
  }
  const newComment = await new CommentModel({
    ...valData.value,
    postID: postID,
    author: req.user._id
  }).save();
  post.comments?.push(newComment._id);
  post.numberOfComments! += 1;
  await post.save();
  res.sendStatus(201);
  if (!(req.user._id.toString() === post.author.toString())) {
    const notificationInfo: notification = {
      message: `${req.user.profile.fullName} commented on your post`,
      user: req.user._id,
      type: "comment",
      userID: post.author._id,
      post: post._id
    };
    await sendNotification(notificationInfo, post.author.toString());
  }
};

export const postUpVote = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  const post = await PostModel.findOne({ _id: postID }).select("+nextCoyn");
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.communityID) {
    const isMember = req.user.profile.communities.some(
      (objectid: Types.ObjectId) => {
        return objectid.equals(post.communityID);
      }
    );

    if (!isMember)
      return res.status(401).json({ message: "Cannot Like this post" });
    // const userCommunities = req.user.communities.map(
    //   (commID: Types.ObjectId) => {
    //     return commID.toString();
    //   }
    // );
    // if (!userCommunities.includes(post.communityID.toString))
    //   return res.status(401).json({ message: "Cannot Like this post" });
  }
  const upvoted = post.upvoteBy?.some((objectid) => {
    return objectid.equals(req.user._id);
  });

  const downVoted = post.downVoteBy?.some((objectid) => {
    return objectid.equals(req.user._id);
  });
  if (downVoted) {
    const result = post.downVoteBy?.filter(
      (objectID) => objectID.toString() !== req.user._id.toString()
    );
    post.downVoteBy = result;
  }
  if (upvoted) {
    const result = post.upvoteBy?.filter(
      (objectID) => objectID.toString() !== req.user._id.toString()
    );
    post.upvoteBy = result;
  } else {
    post.upvoteBy?.push(req.user._id);
  }
  post.upvotes! = post.upvoteBy!.length - post.downVoteBy!.length || 0;
  post.downvotes! = post.downVoteBy?.length || 0;
  await post.save();
  res.sendStatus(200);
  if (!(req.user._id.toString() === post.author.toString()) && !upvoted) {
    const notificationInfo: notification = {
      message: `${req.user.profile.fullName} liked your post`,
      user: req.user._id,
      type: "like",
      userID: post.author._id,
      post: post._id
    };
    await sendNotification(notificationInfo, post.author.toString());
  }
  if (post.upvoteBy?.length === post.nextCoyn) {
    const user = await User.findOne({ _id: post.author });
    if (user?.profile) user.profile.unicoyn += 1;
    post.nextCoyn! += 100;
    await user?.save();
    await post.save();
    const notificationInfo: notification = {
      message: `Congratulations, you have received 1 unicoyn`,
      userID: post.author,
      type: "post",
      post: post.id
    };
    await sendNotification(notificationInfo, post.author.toString());
  }
};

export const postDownVote = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  const post = await PostModel.findOne({ _id: postID });
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.communityID) {
    const userCommunities = req.user.profile.communities.map(
      (commID: Types.ObjectId) => {
        return commID.toString();
      }
    );
    if (!userCommunities.includes(post.communityID.toString))
      return res.status(401).json({ message: "Cannot Like this post" });
  }
  const upvoted = post.upvoteBy?.some((objectid) => {
    return objectid.equals(req.user._id);
  });

  const downVoted = post.downVoteBy?.some((objectid) => {
    return objectid.equals(req.user._id);
  });

  if (upvoted) {
    const result = post.upvoteBy?.filter(
      (objectID) => objectID.toString() !== req.user._id.toString()
    );
    post.upvoteBy = result;
  }
  if (downVoted) {
    const result = post.downVoteBy?.filter(
      (objectID) => objectID.toString() !== req.user._id.toString()
    );
    post.downVoteBy = result;
  } else {
    post.downVoteBy?.push(req.user._id);
  }
  post.upvotes! = post.upvoteBy!.length - post.downVoteBy!.length || 0;
  post.downvotes! = post.downVoteBy?.length || 0;
  await post.save();
  res.sendStatus(200);
};

export const deleteComment = async (req: any, res: Response) => {
  const commentID = new Types.ObjectId(req.params.commentID);
  const comment = await CommentModel.findOne({ _id: commentID });
  if (!comment) return res.status(400).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user._id.toString())
    return res
      .status(401)
      .json({ message: "You are unauthorized to delete this comment" });
  await comment.delete();
  return res.sendStatus(200);
};

export const getPostWithCommID = async (req: any, res: Response) => {
  const { skip, limit } = req.query;
  const dbposts = await PostModel.find({ communityID: { $exists: true } })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .select("-comments +upvoteBy")
    .populate([
      { path: "author", select: "profile.fullName profile.picture" },
      { path: "communityID", select: "_id name picture createdAt" }
    ]);
  const posts = dbposts.map((post) => {
    const postObj = { ...post.toObject() };
    delete postObj.upvoteBy;
    delete postObj.downVoteBy;
    delete postObj.comments;
    return postObj;
  });
  return res.json(posts);
};
