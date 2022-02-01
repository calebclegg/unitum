import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Post, { IProps as IPost } from "../components/Post";
import useSWR from "swr";
import { fetcher } from "../utils";
import { useUser } from "../hooks";

const Feed = () => {
  const { token } = useUser();
  const { data: posts, mutate } = useSWR<IPost[]>(
    token ? ["posts", token] : null,
    fetcher
  );

  return (
    <>
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
          <Post key={post._id} {...post} revalidate={mutate} />
        ))}
      </Stack>
    </>
  );
};

export default Feed;
