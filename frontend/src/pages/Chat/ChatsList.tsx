import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { Link } from "react-router-dom";
import { useData } from "../../hooks";

export interface IChat {
  _id: string;
  chatID: string;
  recipient: {
    _id: string;
    profile: {
      fullName: string;
      picture: string;
    };
  };
  createdAt: string;
  read: boolean;
  numberOfUnreadMessages: number;
  lastMessage: {
    from: "me" | "recipient";
    text: string;
  };
}

const ChatsList = () => {
  const { data: chats } = useData<IChat[]>("/chat");

  return (
    <Box p={2}>
      <Typography variant="h5" component="h1">
        Chats
      </Typography>
      <Stack direction="row" width="min(100%, 350px)" mt={3}>
        <List sx={{ width: "100%" }}>
          {chats?.map((chat) => (
            <ListItem
              key={chat._id}
              component={Link}
              to={`/chat/${chat.chatID}`}
              sx={{ p: 0, mb: 2, alignItems: "flex-start" }}
            >
              <Stack direction="row" flexGrow={1} alignItems="center">
                <ListItemAvatar>
                  <Avatar
                    src={chat.recipient.profile.picture}
                    alt={chat.recipient.profile.fullName}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={chat.recipient.profile.fullName}
                  secondary={chat.lastMessage.text}
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
                  {chat.numberOfUnreadMessages}
                </Typography>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
};

export default ChatsList;
