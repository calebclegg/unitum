import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { PostModel } from "../models/Post";

export const postHandlers = async (io: Server, socket: Socket) => {
  const likePost = async (postID: string) => {
    if (!postID)
      return socket.to(socket.id).emit("Bad Request", "postID is required");

    const post = await PostModel.findOne({ _id: postID });
    if (!post) return socket.to(socket.id).emit("Not Found", "Post not found");
    if (post.communityID) {
      const userCommunities = socket.data.user.communities.map(
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
    if (upvoted) {
      const result = post.upvoteBy?.filter(
        (objectID) => objectID.toString() !== req.user._id.toString()
      );
      post.upvoteBy = result;
      post.upvotes! -= 1;
    } else {
      post.upvoteBy?.push(req.user._id);
      post.upvotes! += 1;
    }
    try {
      await post.save();
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  };
};
