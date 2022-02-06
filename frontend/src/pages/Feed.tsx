import Helmet from "react-helmet";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { useData, usePostsActions } from "../hooks";
import { API } from "../lib";
import { useAuth } from "../context/Auth";

const Feed = () => {
  const { token } = useAuth();
  const { data: posts, mutate } = useData<IPost[]>("posts", {
    refreshInterval: 10000
  });
  const { toggleVote } = usePostsActions(posts, mutate);

  const toggleSave = async (postID: string) => {
    posts?.map((post) => {
      if (post._id === postID) {
        console.log(post);
      }
    });

    await API.delete(`users/me/savedPosts/${postID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

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
          <PostCard key={post._id} {...post} toggleVote={toggleVote} />
        ))}
      </Stack>
    </>
  );
};

export default Feed;
