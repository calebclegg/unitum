import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { useData, usePostsActions } from "../hooks";

const Communities = () => {
  const { data: posts, mutate } = useData<IPost[]>("community/posts");
  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

  return (
    <Stack spacing={4} component="section" id="communities-activities">
      <Typography variant="h4" component="h1">
        Communities Activities
      </Typography>
      <Stack spacing={2}>
        {posts?.map((post) => (
          <PostCard
            {...post}
            key={post._id}
            toggleSave={toggleSave}
            toggleVote={toggleVote}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default Communities;
