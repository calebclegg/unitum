import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TransitionProps } from "@mui/material/transitions";
import { Theme } from "@mui/material/styles";
import { forwardRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUrl } from "../utils";
import { API } from "../lib";
import { useAuth } from "../context/Auth";
import { ICommunity } from "../hooks";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  community?: ICommunity | null;
  revalidate: () => void;
}

const EditCommunity = ({ community, revalidate }: IProps) => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );
  const { token } = useAuth();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const open = hash === "#edit-community";

  const handleClose = () => {
    navigate(getUrl().replace(hash, ""));
  };

  const editCommunity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setUpdating(true);
      const formData = new FormData(event.currentTarget);
      const requestData = Object.fromEntries(formData.entries());

      await API.patch(`community/${comm_id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      revalidate();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
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
      <form method="post" action="#" onSubmit={editCommunity}>
        <Stack>
          <DialogTitle>Edit community info</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              minRows={2}
              id="community-name"
              name="name"
              label="Community Name"
              variant="outlined"
              defaultValue={community?.name}
              margin="normal"
            />
            <TextField
              multiline
              fullWidth
              minRows={3}
              label="Description"
              defaultValue={community?.description}
              id="community-description"
              name="description"
              variant="outlined"
              margin="normal"
            />
          </DialogContent>
        </Stack>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton type="submit" variant="contained" loading={updating}>
            Edit community
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCommunity;
