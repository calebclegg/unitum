import Popover from "@mui/material/Popover";
import NotificationsList from "./NotificationsList";

interface IProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
}

const Notifications = ({ anchorEl, handleClose }: IProps) => {
  return (
    <Popover
      id="notifications"
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      PaperProps={{
        sx: {
          mt: 1.375,
          width: "min(350px, 100%)",
          maxHeight: 400
        }
      }}
    >
      <NotificationsList />
    </Popover>
  );
};

export default Notifications;
