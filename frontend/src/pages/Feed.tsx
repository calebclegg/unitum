import Helmet from "react-helmet";
import FeedLayout from "../components/FeedLayout";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { useData, usePostsActions } from "../hooks";

const Feed = () => {
  const { data: posts, mutate } = useData<IPost[]>("posts", {
    refreshInterval: 10000
  });
  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

  return (
    <>
      <Helmet>
        <title>Feed</title>
      </Helmet>
      <FeedLayout title="Feed">
        {posts?.map((post) => (
          <PostCard
            {...post}
            key={post._id}
            toggleSave={toggleSave}
            toggleVote={toggleVote}
          />
        ))}
      </FeedLayout>
    </>
  );
};

export default Feed;
