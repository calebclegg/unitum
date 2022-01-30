import Popover from "@mui/material/Popover";
import NotificationsList from "./NotificationsList";
import { useOpenWithHash } from "../../hooks";

interface IProps {
  anchorEl: HTMLButtonElement | null;
}

const Notifications = ({ anchorEl }: IProps) => {
  const { open, handleClose } = useOpenWithHash("#notification");

  return (
    <Popover
      id="notifications"
      open={open}
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
