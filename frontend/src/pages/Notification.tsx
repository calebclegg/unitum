import ArrowBack from "@mui/icons-material/ArrowBack";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/system/Box";
import { Link } from "react-router-dom";
import NotificationsList from "../components/Notifications/NotificationsList";
import { useOpenWithHash } from "../hooks";

const Notification = () => {
  const { open, handleClose } = useOpenWithHash("/notifications");

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.history.length > 2) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <Box mb={2}>
        <IconButton
          component={Link}
          to="/feed"
          aria-label="go back"
          onClick={goBack}
        >
          <ArrowBack />
        </IconButton>
      </Box>
      <NotificationsList />
    </Dialog>
  );
};

export default Notification;
