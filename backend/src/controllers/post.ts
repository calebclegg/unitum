import { Response } from "express";
import { Types } from "mongoose";
import CommunityModel from "../models/Community";
import { CommentModel, PostModel } from "../models/Post";
import { SavedPost } from "../models/SavedPost";
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
    try {
      community = await CommunityModel.findOne({
        _id: valData.value.communityID
      });
      if (!community)
        return res.status(404).json({ message: "Community not found" });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
  try {
    const newPost = await new PostModel({
      ...valData.value,
      author: user._id
    }).save();
    res.status(201).json(newPost);
    if (community) {
      const notificationInfo: notification = {
        message: `${req.user.profile.fullName} added a new post in ${community.name}`,
        type: "community",
        user: user._id,
        post: newPost._id
      };
      await sendNotification(
        req.socket,
        notificationInfo,
        community._id.toString()
      );
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

// get posts
export const getPosts = async (req: any, res: Response) => {
  const user = req.user;
  const communityID = req.query.communityID || null;
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 20;

  let dbPosts;
  try {
    if (communityID) {
      dbPosts = await PostModel.find({ communityID: communityID })
        .sort("createdAt")
        .select("-comments +upvoteBy")
        .populate([
          { path: "author", select: "profile.fullName" },
          { path: "communityID", select: "-__v -members" }
        ])
        .skip(skip)
        .limit(limit);
    } else {
      dbPosts = await PostModel.find({})
        .sort("createdAt")
        .select("-comments +upvoteBy")
        .populate([
          { path: "author", select: "profile.fullName" },
          { path: "communityID", select: "-__v -members" }
        ])
        .skip(skip)
        .limit(limit);
    }
    const savedPosts = await SavedPost.findOne({ userID: user._id });
    const posts = dbPosts.map((post: any) => {
      const upvoted = post.upvoteBy?.some((objectid: any) => {
        return objectid.equals(user._id);
      });

      const downvoted = post.downVoteBy?.some((objectid: any) => {
        return objectid.equals(req.user._id);
      });
      let saved;
      if (savedPosts) {
        saved = savedPosts.posts.some((objectid: Types.ObjectId) => {
          return objectid.equals(post._id);
        });
      }
      delete post.upvoteBy;
      return {
        ...post.toObject(),
        upvoted: upvoted,
        downvoted: downvoted,
        saved: saved
      };
    });
    console.log(posts);
    return res.status(200).json(posts);
  } catch (error) {
    return res.sendStatus(500);
  }
};

// get post details
export const getPostDetails = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  try {
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
    console.log(post);
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

export const getPostComments = async (req: any, res: Response) => {
  const user = req.user;
  const postID = new Types.ObjectId(req.params.postID);
  const limit = req.query.limit || 20;
  const skip = req.query.skip || 0;
  try {
    const comments = await CommentModel.find({ postID: postID })
      .skip(skip)
      .limit(limit)
      .select(["-__v"]);
    return res.status(200).json(comments);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const addPostComment = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  const valData = await validateCommentCreateData(req.body);
  const post = await PostModel.findOne({ _id: postID });
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.communityID) {
    const userCommunities = req.user.communities.map(
      (commID: Types.ObjectId) => {
        return commID.toString();
      }
    );
    if (!userCommunities.includes(post.communityID.toString))
      return res.status(401).json({ message: "Cannot comment on this post" });
  }

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
    const newComment = await new CommentModel({
      ...valData.value,
      postID: postID,
      author: req.user._id
    }).save();
    post.comments?.push(newComment._id);
    post.numberOfComments! += 1;
    await post.save();
    const notificationInfo: notification = {
      message: `${req.user.profile.fullName} commented on your post`,
      user: req.user._id,
      type: "post",
      userID: post.author._id,
      post: post._id
    };
    res.sendStatus(201);
    await sendNotification(
      req.socket,
      notificationInfo,
      post.author._id.toString()
    );
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const postUpVote = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  const post = await PostModel.findOne({ _id: postID });
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.communityID) {
    const userCommunities = req.user.communities.map(
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
  if (downVoted) {
    const result = post.downVoteBy?.filter(
      (objectID) => objectID.toString() !== req.user._id.toString()
    );
    post.downVoteBy = result;
    post.upvoteBy?.push(req.user._id);
  }
  if (upvoted) {
    const result = post.upvoteBy?.filter(
      (objectID) => objectID.toString() !== req.user._id.toString()
    );
    post.upvoteBy = result;
  } else {
    post.upvoteBy?.push(req.user._id);
  }
  post.upvotes! = post.upvoteBy?.length || 0;
  post.downvotes! = post.downVoteBy?.length || 0;
  try {
    await post.save();
    const notificationInfo: notification = {
      message: `${req.user.profile.fullName} liked your post`,
      user: req.user._id,
      type: "post",
      userID: post.author._id,
      post: post._id
    };
    res.sendStatus(200);
    await sendNotification(
      req.io,
      notificationInfo,
      post.author._id.toString()
    );
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const postDownVote = async (req: any, res: Response) => {
  const postID = new Types.ObjectId(req.params.postID);
  const post = await PostModel.findOne({ _id: postID });
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.communityID) {
    const userCommunities = req.user.communities.map(
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
  post.upvotes! = post.upvoteBy?.length || 0;
  post.downvotes! = post.downVoteBy?.length || 0;
  try {
    await post.save();
    res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteComment = async (req: any, res: Response) => {
  const commentID = new Types.ObjectId(req.params.commentID);
  const comment = await CommentModel.findOne({ _id: commentID });
  if (!comment) return res.status(400).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user._id.toString())
    return res
      .status(401)
      .json({ message: "You are unauthorized to delete this comment" });
  try {
    await comment.delete();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};
