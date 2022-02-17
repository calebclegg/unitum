import ArrowBack from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { Link } from "react-router-dom";
import { useData, useOpenWithHash } from "../hooks";

export interface IMessage {
  _id: string;
  chatID: string;
  createdAt: string;
  from: {
    email: string;
    profile: {
      fullName: string;
      picture: string;
      _id: string;
    };
  };
  read: boolean;
  text: string;
}

const Notification = () => {
  const { open, handleClose } = useOpenWithHash("/chat");
  const { data: messages } = useData<IMessage[]>("/chat/messages/unread");

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.history.length > 2) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <Dialog fullScreen open={open} id="messages" onClose={handleClose}>
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
      <Typography variant="h5" component="h1">
        Chats
      </Typography>
      <Stack direction="row" width="min(100%, 350px)">
        <List sx={{ width: "100%" }}>
          {messages?.map((message) => (
            <ListItem
              key={message._id}
              component={Link}
              to={`/chat/${message.chatID}`}
              sx={{ p: 0, mb: 2, alignItems: "flex-start" }}
            >
              <Stack direction="row" flexGrow={1} alignItems="center">
                <ListItemAvatar>
                  <Avatar
                    src={message.from.profile.picture}
                    alt={message.from.profile.fullName}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={message.from.profile.fullName}
                  secondary={message.text}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </Stack>
              <Stack alignItems="flex-end" spacing={0.5}>
                <Typography variant="caption" sx={{ mt: 1 }}>
                  12 mins ago
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    bgcolor: "secondary.light",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  4
                </Typography>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Notification;
