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
import SelectCommunity from "./SelectCommunity";
import { TransitionProps } from "@mui/material/transitions";
import { styled, Theme } from "@mui/material/styles";
import { forwardRef, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUrl } from "../utils";
import { API } from "../lib";
import { useAuth } from "../context/Auth";
import {
  Avatar,
  Card,
  CardContent,
  FormControl,
  Typography
} from "@mui/material";
import { useUser } from "../hooks";

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
  const [mediaPreview, setMediaPreview] = useState<(string | ArrayBuffer)[]>(
    []
  );
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const [creatingPost, setCreatingPost] = useState(false);
  const { user } = useUser();
  const handleClose = () => {
    setFiles([]);
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
        setFiles((prev) => [...prev, file]);
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

      if (formData.get("communityID") === "wall") {
        formData.delete("communityID");
      }

      const uploadData = new FormData();
      for (const file of files) {
        uploadData.append("media", file);
      }

      setCreatingPost(true);
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
        if (key === "communityID" && value === "wall") continue;
        if (key === "media") {
          requestData[key] = imgURLs;
          continue;
        }

        requestData[key] = value;
      }

      const { data } = await API.post("posts", requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate(`/posts/${data._id}`, { replace: true });
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingPost(false);
    }
  };

  return (
    <Card
      sx={{
        width: "100%"
      }}
      title="Create New Post"
    >
      <form method="post" action="#" onSubmit={createPost}>
        <Stack>
          <CardContent>
            <Stack direction="row">
              <Avatar
                src={user?.profile.picture}
                sx={{ width: 50, height: 50, mr: 2 }}
              />

              <FormControl
                fullWidth
                id="post"
                name="body"
                component="textarea"
                required={true}
                aria-label="post content"
                placeholder="What's on your mind?"
                sx={{ mb: 1.4, outline: "none" }}
              />
            </Stack>

            <Collapse in={Boolean(mediaPreview?.length)}>
              <Stack direction="row" spacing={tabletUp ? 1 : 2} my={1.5}>
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
            <Stack
              sx={{ position: "relative" }}
              spacing={3}
              direction={tabletUp ? "row" : "column"}
              alignItems="stretch"
            >
              <div>
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
                  sx={{ height: "100%" }}
                  type="button"
                  variant="outlined"
                  onClick={selectMedia}
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  <span>Add image</span>
                </Button>
              </div>
              <SelectCommunity />
              <LoadingButton
                type="submit"
                variant="contained"
                loading={creatingPost}
                sx={{ position: "absolute", right: 0 }}
              >
                Create Post
              </LoadingButton>
            </Stack>
          </CardContent>
        </Stack>
      </form>
    </Card>
  );
};

export default CreatePost;
