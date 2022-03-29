import { useParams } from "react-router-dom";
import Helmet from "react-helmet";
import LoadingButton from "@mui/lab/LoadingButton";
import Edit from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { ICommunity, useData, usePostsActions, useUser } from "../hooks";
import { API } from "../lib";
import { lazy, Suspense, useState } from "react";
import { useAuth } from "../context/Auth";
import EditableAvatar from "../components/EditableAvatar";

const EditCommunity = lazy(() => import("../components/EditCommunity"));
const ConfirmDialog = lazy(() => import("../components/ConfirmDialog"));

const Community = () => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { token } = useAuth();
  const { user } = useUser();
  const [sendingJoinRequest, setSendingJoinRequest] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: community, mutate: updateCommunity } = useData<ICommunity>(
    `community/${comm_id}`
  );
  const { data: posts, mutate: updatePosts } = useData<IPost[]>(
    `posts?communityID=${comm_id}`
  );

  const { toggleSave, toggleVote } = usePostsActions(posts, updatePosts);

  const refInMembers = community?.members.find(
    (member) => member.info._id === user?._id
  );

  const isMember = user ? Boolean(refInMembers) : false;

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

  const openConfirmDialog = () => {
    if (community?.admin._id !== user?._id) {
      setIsDialogOpen(true);
    }
  };
  const closeConfirmDialog = () => setIsDialogOpen(false);

  return (
    <>
      <Helmet>
        <title>{community?.name || "Loading..."} | Community</title>
        {community?.description ? (
          <meta name="description" content={community.description} />
        ) : null}
      </Helmet>
      <Paper
        square
        variant="outlined"
        sx={{ mb: 4, p: 4, position: "relative" }}
      >
        {community?.admin._id === user?._id && (
          <IconButton
            href="#edit-community"
            size="small"
            sx={{
              position: "absolute",
              top: ({ spacing }) => spacing(2),
              right: ({ spacing }) => spacing(2)
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        )}
        <Grid container spacing={2}>
          <Grid
            item
            width={104}
            height={104}
            position="relative"
            borderRadius={2}
            bgcolor="#cacaca68"
            sx={{
              "&.MuiGrid-item": {
                pl: 0,
                pt: 0
              }
            }}
          >
            <EditableAvatar
              src={community?.picture || ""}
              endpoint={`community/${comm_id}`}
              revalidate={updateCommunity}
            />
          </Grid>
          <Grid item spacing={2}>
            <Typography variant="h4" component="h1">
              {community?.name}
            </Typography>
            {isMember ? (
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
        <EditCommunity community={community} revalidate={updateCommunity} />
      </Suspense>
      <Suspense fallback={<div />}>
        <ConfirmDialog open={isDialogOpen} handleClose={closeConfirmDialog} />
      </Suspense>
    </>
  );
};

export default Community;
