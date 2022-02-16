import { useParams } from "react-router-dom";
import Helmet from "react-helmet";
import LoadingButton from "@mui/lab/LoadingButton";
import Edit from "@mui/icons-material/Edit";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CircularProgress from "@mui/material/CircularProgress";
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
import { lazy, Suspense, useRef, useState } from "react";
import { useAuth } from "../context/Auth";

const EditCommunity = lazy(() => import("../components/EditCommunity"));
const ConfirmDialog = lazy(() => import("../components/ConfirmDialog"));

const Community = () => {
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const { comm_id } = useParams<{ comm_id: string }>();
  const { user } = useUser();
  const { token } = useAuth();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [sendingJoinRequest, setSendingJoinRequest] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { data: community, mutate: updateCommunity } = useData<ICommunity>(
    `community/${comm_id}`
  );
  const { data: posts, mutate: updatePosts } = useData<IPost[]>(
    `posts?communityID=${comm_id}`
  );

  const { toggleSave, toggleVote } = usePostsActions(posts, updatePosts);

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

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files) {
      const [file] = files;
      setFile(file);
      const reader = new FileReader();

      reader.addEventListener("load", (event) => {
        if (event.target?.result) setPreview(event.target.result);
      });

      reader.readAsDataURL(file);
    }
  };

  const removePreview = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPreview(null);
    if (uploadFileRef.current) uploadFileRef.current.value = "";
    event.currentTarget.blur();
  };

  const savePreview = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setUploading(true);

      // Upload preview
      const uploadData = new FormData();
      if (file) {
        uploadData.append("media", file);
      }

      const {
        data: [imageURL]
      } = await API.post<string[]>("uploads", uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      // Update community
      const { data } = await API.patch(
        `community/${comm_id}`,
        {
          picture: imageURL
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log({ data });
      await updatePosts();
      removePreview(event);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const openConfirmDialog = () => setIsDialogOpen(true);
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
        <Grid container spacing={2}>
          <Grid
            item
            width={104}
            height={104}
            position="relative"
            borderRadius={2}
            bgcolor="#cacaca68"
            sx={{
              transition: ({ transitions }) =>
                transitions.create("background-color", {
                  duration: transitions.duration.shortest
                }),

              "&.MuiGrid-item": {
                pl: 0,
                pt: 0
              },

              "&:hover, &:focus-within": {
                bgcolor: "#121212AA",

                "& .MuiIconButton-root": {
                  opacity: 1
                },

                "& .MuiAvatar-root": {
                  opacity: 0.15
                }
              }
            }}
          >
            {uploading ? (
              <Stack
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                position="absolute"
                zIndex={({ zIndex }) => zIndex.mobileStepper}
              >
                <CircularProgress size={25} />
              </Stack>
            ) : preview ? (
              <Stack
                width="100%"
                height="100%"
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                top="50%"
                left="50%"
                position="absolute"
                zIndex={({ zIndex }) => zIndex.mobileStepper}
                sx={{
                  transform: "translate(-50%, -50%)",

                  "& .MuiIconButton-root": {
                    bgcolor: "#fffd",
                    "&:hover": {
                      bgcolor: "#fff"
                    }
                  }
                }}
              >
                <IconButton size="small" color="error" onClick={removePreview}>
                  <Close fontSize="small" />
                </IconButton>
                <IconButton size="small" color="primary" onClick={savePreview}>
                  <Check fontSize="small" />
                </IconButton>
              </Stack>
            ) : (
              <IconButton
                sx={{
                  color: "grey.100",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  opacity: 0,
                  transform: "translate(-50%, -50%)",
                  transition: ({ transitions }) =>
                    transitions.create("opacity", {
                      duration: transitions.duration.shortest
                    }),
                  zIndex: ({ zIndex }) => zIndex.mobileStepper
                }}
                onClick={() => uploadFileRef.current?.click()}
              >
                <PhotoCamera />
              </IconButton>
            )}
            <input
              ref={uploadFileRef}
              onChange={uploadImage}
              type="file"
              name="avatar"
              id="community-avatar"
              accept="image/*"
              hidden
            />
            <Avatar
              variant="rounded"
              src={preview?.toString() || community?.picture}
              alt=""
              sx={{
                width: "inherit",
                height: "inherit",
                transition: ({ transitions }) =>
                  transitions.create("opacity", {
                    duration: transitions.duration.shortest
                  })
              }}
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
        <EditCommunity community={community} revalidate={updateCommunity} />
      </Suspense>
      <Suspense fallback={<div />}>
        <ConfirmDialog open={isDialogOpen} handleClose={closeConfirmDialog} />
      </Suspense>
    </>
  );
};

export default Community;
