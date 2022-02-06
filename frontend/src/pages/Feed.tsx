import Helmet from "react-helmet";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
      <Paper
        square
        variant="outlined"
        sx={{
          px: 3,
          py: 1.5,
          maxWidth: ({ breakpoints }) => breakpoints.values.md
        }}
      >
        <Typography variant="h5" fontWeight={500} component="h1">
          Feed
        </Typography>
      </Paper>
      <Stack
        spacing={2}
        maxWidth={({ breakpoints }) => breakpoints.values.md}
        sx={{
          "& .MuiPaper-rounded:first-of-type": {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }
        }}
      >
        {posts?.map((post) => (
          <PostCard
            {...post}
            key={post._id}
            toggleSave={toggleSave}
            toggleVote={toggleVote}
          />
        ))}
      </Stack>
    </>
  );
};

export default Feed;
