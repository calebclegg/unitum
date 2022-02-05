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
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/system/Box";
import React, { useEffect, useRef, useState } from "react";
import { styled, Theme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { getUrl } from "../utils";
import { API } from "../lib";
import { useAuth } from "../context/Auth";

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
  const laptopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("md")
  );
  const { token } = useAuth();
  const { hash } = useLocation();
  const [mediaPreview, setMediaPreview] = useState<(string | ArrayBuffer)[]>(
    []
  );
  const navigate = useNavigate();
  const [creatingPost, setCreatingPost] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hash === "#create-post") setOpen(true);
    else setOpen(false);
  }, [hash]);

  const handleClose = () => {
    setMediaPreview([]);
    navigate(getUrl().replace(hash, ""));
  };

  const selectMedia = () => {
    uploadRef.current?.click();
  };

  const removeMedia = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { dataset } = event.currentTarget;

    setMediaPreview((prev) =>
      prev.filter((media) => media !== dataset.preview)
    );
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files?.length) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();

        reader.addEventListener("load", (event) => {
          setMediaPreview((prev) => {
            const previews = prev ? [...prev] : [];

            if (
              !event.target?.result ||
              previews.includes(event.target.result)
            ) {
              return [...previews];
            }

            return [...previews, event.target.result];
          });
        });

        reader.readAsDataURL(file);
      });
    }
  };

  const createPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      setCreatingPost(true);
      const { data } = await API.post("posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      navigate(data._id);
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingPost(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: ({ breakpoints }) => `min(${breakpoints.values.sm}px, 100%)`
        }
      }}
      fullScreen={!laptopUp}
    >
      <form method="post" action="#" onSubmit={createPost}>
        <Stack>
          <DialogTitle>Create new post</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              fullWidth
              autoFocus
              rows={2}
              id="post"
              name="content"
              variant="standard"
              label="Type something here"
              inputProps={{ required: true }}
              sx={{ mb: 1.4 }}
            />
            <Collapse in={Boolean(mediaPreview?.length)}>
              <Stack direction="row" spacing={tabletUp ? 1 : 2} my={1.4}>
                {mediaPreview?.map((preview) => (
                  <Box
                    key={preview.toString()}
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
                      data-preview={preview.toString()}
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
                      src={preview.toString()}
                      alt=""
                      width="60"
                      height="60"
                    />
                  </Box>
                ))}
              </Stack>
            </Collapse>
            <input
              multiple
              type="file"
              name="media"
              id="post-media"
              accept="image/*"
              ref={uploadRef}
              onChange={uploadFile}
              hidden
            />
            <Button
              size="small"
              type="button"
              variant="outlined"
              onClick={selectMedia}
              startIcon={<AddPhotoAlternateIcon />}
            >
              Add image
            </Button>
          </DialogContent>
        </Stack>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={creatingPost}
          >
            Create Post
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePost;
