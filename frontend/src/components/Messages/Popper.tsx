import Popover from "@mui/material/Popover";
import { useState } from "react";
import { useOpenWithHash } from "../../hooks";
import MessagesList from "./MessagesList";

interface IProps {
  anchorEl: HTMLButtonElement | null;
}

const Notifications = ({ anchorEl }: IProps) => {
  const { open, handleClose } = useOpenWithHash("#messages");
  const [secondaryTextEl, setSecondaryTextEl] =
    useState<HTMLParagraphElement | null>(null);

  return (
    <Popover
      id="messages"
      open={Boolean(open && anchorEl)}
      anchorEl={anchorEl}
      TransitionProps={{
        onTransitionEnd: () => {
          const el = document.querySelector<HTMLParagraphElement>(
            "#messages .MuiListItemText-secondary"
          );

          el && setSecondaryTextEl(el);
        }
      }}
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
      <MessagesList secondaryTextEl={secondaryTextEl} />
    </Popover>
  );
};

export default Notifications;
