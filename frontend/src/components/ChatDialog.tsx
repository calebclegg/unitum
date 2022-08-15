import Draggable from "react-draggable";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Paper, { PaperProps } from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { useData } from "../hooks";
import { IChat } from "../pages/Chat";
import ChatMessages from "../pages/Chat/ChatMessages";
import ChatsList from "../pages/Chat/ChatsList";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useEffect, useMemo } from "react";

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const ChatDialog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatID = searchParams.get("chat_id");
  const { hash, pathname } = useLocation();
  const { data: chats } = useData<IChat[]>("chat");
  const { breakpoints } = useTheme();
  const open = useMemo(() => hash === "#chat", [hash]);
  const laptopDown = useMediaQuery(breakpoints.down("lg"));

  const currentChat = chats?.find((chat) => chat.chatID === chatID);

  const numberOfMessages = chats?.reduce(
    (acc, curr) => acc + curr.numberOfUnreadMessages,
    0
  );

  const handleClose = () => {
    navigate(pathname);
  };

  useEffect(() => {
    if (open && laptopDown) {
      navigate(chatID ? `/chat/${chatID}` : "/chat", {
        replace: true,
        state: { previousPage: window.location.href }
      });
    }
  }, [open, laptopDown]);

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const previousURL = new URL(document.referrer);
    if (previousURL.origin === window.location.origin) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      PaperProps={{
        sx: {
          p: 0,
          m: 0,
          bottom: 0,
          right: "15%",
          width: 400,
          height: "65vh",
          position: "absolute",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          bgcolor: "background.default"
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Stack
          p={2}
          mb={2}
          bgcolor="#fff"
          borderBottom="1px solid"
          borderColor="divider"
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            component={Link}
            to={"/feed"}
            aria-label="go back"
            onClick={goBack}
          >
            <ArrowBack />
          </IconButton>
          {currentChat ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h5" component="h1">
                {currentChat.recipient.profile.fullName}
              </Typography>
              <Avatar
                src={currentChat.recipient.profile.picture}
                alt={currentChat.recipient.profile.fullName}
              />
            </Stack>
          ) : null}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {chatID ? (
          <ChatMessages
            recipientID={currentChat?.recipient._id || ""}
            numberOfUnreadMessages={numberOfMessages || 0}
          />
        ) : (
          <ChatsList selected={currentChat?.chatID} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
