import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { useData } from "../hooks";
import Helmet from "react-helmet";
const Feed = () => {
  const { data: posts, mutate } = useData<IPost[]>("posts");

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
          <PostCard key={post._id} {...post} revalidate={mutate} />
        ))}
      </Stack>
    </>
  );
};

export default Feed;
