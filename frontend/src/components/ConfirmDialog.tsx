import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { API } from "../lib";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/Auth";

interface IProps {
  open: boolean;
  handleClose: () => void;
}

const ConfirmDialog = ({ open, handleClose }: IProps) => {
  const { token } = useAuth();
  const { comm_id } = useParams<{ comm_id: string }>();
  const [leavingCommunity, setLeavingCommunity] = useState(false);

  const leaveCommunity = async () => {
    try {
      setLeavingCommunity(true);
      const { data } = await API.delete(`community/${comm_id}/leave`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log({ data });
    } catch (error) {
      console.log(error);
    } finally {
      setLeavingCommunity(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Do you wish to leave?</DialogTitle>
      <DialogActions>
        <Button variant="text">No</Button>
        <LoadingButton
          color="error"
          variant="contained"
          onClick={leaveCommunity}
          loading={leavingCommunity}
        >
          Leave
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
