import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef, useState } from "react";
import { API } from "../lib";
import { useAuth } from "../context/Auth";
import { KeyedMutator } from "swr";
import { SxProps, Theme } from "@mui/material";

interface IProps {
  src?: string;
  alt?: string;
  styles?: SxProps<Theme>;
  endpoint: string;
  revalidate: KeyedMutator<any>;
}

const EditableAvatar = ({ src, alt, endpoint, styles, revalidate }: IProps) => {
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

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
    const uploadData = new FormData();

    if (file) {
      uploadData.append("media", file);
    }

    try {
      setUploading(true);

      // Upload preview
      const {
        data: [imageURL]
      } = await API.post<string[]>("uploads", uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      const payload = endpoint.includes("community")
        ? {
            picture: imageURL
          }
        : { profile: { picture: imageURL } };

      // Send update request
      const { data } = await API.patch(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log({ data });
      await revalidate();
      removePreview(event);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        transition: ({ transitions }) =>
          transitions.create("background-color", {
            duration: transitions.duration.shortest
          }),

        "&:hover, &:focus-within": {
          bgcolor: "#121212AA",

          "& .MuiIconButton-root": {
            opacity: 1
          },

          "& .MuiAvatar-root": {
            opacity: 0.15
          }
        },
        ...(styles || {})
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
        src={preview?.toString() || src}
        alt={alt || ""}
        sx={{
          width: "inherit",
          height: "inherit",
          transition: ({ transitions }) =>
            transitions.create("opacity", {
              duration: transitions.duration.shortest
            })
        }}
        imgProps={{ alt: "" }}
      />
    </Box>
  );
};

export default EditableAvatar;
