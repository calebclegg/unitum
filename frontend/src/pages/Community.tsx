import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
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
import { API } from "../lib";
import { lazy, Suspense, useState } from "react";
import { useAuth } from "../context/Auth";

const ConfirmDialog = lazy(() => import("../components/ConfirmDialog"));

const Community = () => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { user } = useUser();
  const { token } = useAuth();
  const [sendingJoinRequest, setSendingJoinRequest] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: community } = useData<ICommunity>(`community/${comm_id}`);
  const { data: posts, mutate } = useData<IPost[]>(
    `posts?communityID=${comm_id}`
  );

  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

  // const isMember = user ? community?.members.includes(user._id) : false;

  const sendJoinRequest = async () => {
    try {
      setSendingJoinRequest(true);
      const { data } = await API.post(`community/${comm_id}/join`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log({ data });
    } catch (error) {
      console.log(error);
    } finally {
      setSendingJoinRequest(false);
    }
  };

  const openConfirmDialog = () => setIsDialogOpen(true);
  const closeConfirmDialog = () => setIsDialogOpen(false);

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
            {Math.random() < 10 ? ( // Replace with isMember logic
              <Button
                variant="outlined"
                onClick={openConfirmDialog}
                sx={{ mt: 2 }}
              >
                Joined
              </Button>
            ) : (
              <LoadingButton
                loading={sendingJoinRequest}
                variant="contained"
                onClick={sendJoinRequest}
                sx={{ mt: 2 }}
              >
                Join Community
              </LoadingButton>
            )}
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
      <Suspense fallback={<div />}>
        <ConfirmDialog open={isDialogOpen} handleClose={closeConfirmDialog} />
      </Suspense>
    </>
  );
};

export default Community;
