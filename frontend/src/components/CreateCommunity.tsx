import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Close from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/system/Box";
import { TransitionProps } from "@mui/material/transitions";
import { styled, Theme } from "@mui/material/styles";
import { forwardRef, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUrl } from "../utils";
import { API } from "../lib";
import { useAuth } from "../context/Auth";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MediaPreview = styled("img")`
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid grey;
`;

const CreatePost = () => {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );
  const { token } = useAuth();
  const { hash } = useLocation();
  const [mediaPreview, setMediaPreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const open = hash === "#create-community";

  const handleClose = () => {
    setMediaPreview(null);
    navigate(getUrl().replace(hash, ""));
  };

  const selectMedia = () => {
    uploadRef.current?.click();
  };

  const removeMedia = () => {
    setMediaPreview(null);
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files) {
      const [file] = files;
      const reader = new FileReader();

      reader.addEventListener("load", (event) => {
        if (event.target?.result) setMediaPreview(event.target.result);
      });

      reader.readAsDataURL(file);
    }
  };

  const createCommunity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const file = formData.get("picture");

      const uploadData = new FormData();
      if (file) {
        uploadData.append("media", file);
      }

      setLoading(true);
      const { data: imgURLs } = await API.post<string[]>(
        "uploads",
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const requestData: Record<string, unknown> = {};

      for (const [key, value] of formData.entries()) {
        if (key === "picture") {
          requestData[key] = imgURLs[0];
          continue;
        }

        requestData[key] = value;
      }

      const { data } = await API.post("community", requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate(`/communities/${data._id}`, { replace: true });
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        id: "create-post",
        sx: {
          width: ({ breakpoints }) => `min(${breakpoints.values.sm}px, 100%)`
        }
      }}
      fullScreen={!tabletUp}
      TransitionComponent={tabletUp ? undefined : Transition}
    >
      <form
        method="post"
        action="#"
        encType="multipart/form-data"
        onSubmit={createCommunity}
      >
        <Stack>
          <DialogTitle>Create new Community</DialogTitle>
          <DialogContent>
            <TextField
              required
              fullWidth
              autoFocus
              autoComplete="off"
              autoCapitalize="on"
              minRows={2}
              id="name-input"
              name="name"
              variant="outlined"
              margin="normal"
              label="Community Name"
            />
            <TextField
              fullWidth
              multiline
              autoCapitalize="on"
              minRows={2}
              id="description-input"
              name="description"
              variant="outlined"
              margin="normal"
              label="Description"
            />
            <Collapse in={Boolean(mediaPreview)}>
              <Stack direction="row" spacing={tabletUp ? 1 : 2} my={1.5}>
                {mediaPreview && (
                  <Box
                    key={mediaPreview.toString()}
                    position="relative"
                    sx={({ breakpoints }) => ({
                      "& .MuiIconButton-root": {
                        visibility: "visible",

                        [breakpoints.up("md")]: {
                          visibility: "hidden"
                        }
                      },

                      "&:hover, &:focus": {
                        "& .MuiIconButton-root": {
                          visibility: "visible"
                        }
                      }
                    })}
                  >
                    <IconButton
                      size="small"
                      data-preview={mediaPreview.toString()}
                      aria-label="remove image"
                      sx={{
                        p: 0.4,
                        top: 0,
                        right: 0,
                        position: "absolute",
                        bgcolor: "#A5A5A5AA",
                        transform: "translate(50%, -50%)"
                      }}
                      onClick={removeMedia}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                    <MediaPreview
                      src={mediaPreview.toString()}
                      alt=""
                      width="60"
                      height="60"
                    />
                  </Box>
                )}
              </Stack>
            </Collapse>
            <Stack
              spacing={3}
              direction={tabletUp ? "row" : "column"}
              alignItems="stretch"
            >
              <div>
                <input
                  multiple
                  type="file"
                  name="picture"
                  id="post-media"
                  accept="image/*"
                  ref={uploadRef}
                  onChange={uploadFile}
                  hidden
                />
                <Button
                  sx={{ height: "100%" }}
                  type="button"
                  variant="outlined"
                  onClick={selectMedia}
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  <span>Upload Image</span>
                </Button>
              </div>
            </Stack>
          </DialogContent>
        </Stack>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Create Community
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePost;
