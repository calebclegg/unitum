import { KeyedMutator } from "swr";
import { IProps as IPost } from "../components/PostCard";
import { useAuth } from "../context/Auth";
import { API } from "../lib";

export const usePostsActions = (
  posts: IPost[] | null,
  mutate: KeyedMutator<IPost[]>
) => {
  const { token } = useAuth();

  const toggleVote = async (postID: string, action: "upvote" | "downvote") => {
    const updated = posts?.map((post) => {
      if (post._id === postID) {
        const postCopy = { ...post };

        if (action === "upvote") {
          postCopy.upvoted = !post.upvoted;
          postCopy.downvoted = false;

          post.upvoted ? postCopy.upvotes-- : postCopy.upvotes++;
          post.downvoted && postCopy.upvotes++;
        } else {
          postCopy.downvoted = !post.downvoted;
          postCopy.upvoted = false;

          post.downvoted ? postCopy.upvotes++ : postCopy.upvotes--;
          post.upvoted && postCopy.upvotes--;
        }

        return postCopy;
      }

      return post;
    });

    mutate(updated, false);

    try {
      await API.patch(`posts/${postID}/${action}`, undefined, {
        headers: { Authorization: `Bearer ${token}` }
      });

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return { toggleVote };
};
