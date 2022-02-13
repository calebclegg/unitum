import { useParams } from "react-router-dom";
import Edit from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { ICommunity, useData, usePostsActions, useUser } from "../hooks";

const Community = () => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { user } = useUser();
  const { data: community } = useData<ICommunity>(`community/${comm_id}`);
  const { data: posts, mutate } = useData<IPost[]>(
    `posts?communityID=${comm_id}`
  );

  // const isMember = user ? community?.members.includes(user._id) : false;

  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

  return (
    <>
      <Paper
        square
        variant="outlined"
        sx={{ mb: 4, p: 4, position: "relative" }}
      >
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: ({ spacing }) => spacing(2),
            right: ({ spacing }) => spacing(2)
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar
              variant="rounded"
              sx={{
                width: 94,
                height: 94,
                backgroundColor: "#cacaca68"
              }}
              src={community?.picture}
              alt=""
            />
          </Grid>
          <Grid item spacing={2}>
            <Typography variant="h4" component="h1">
              {community?.name}
            </Typography>
            <Button sx={{ mt: 2 }}>Join Community</Button>
          </Grid>
        </Grid>
      </Paper>
      <Stack spacing={2} width="100%" mb={6}>
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

export default Community;
