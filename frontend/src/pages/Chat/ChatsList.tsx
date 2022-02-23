import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, Theme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useData } from "../../hooks";
import { IChat } from ".";

const ChatsList = ({ selected }: Partial<{ selected: string }>) => {
  const { data: chats } = useData<IChat[]>("/chat");
  const laptopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("lg")
  );

  const getChatPathForDesktop = (chatID: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("chat_id", chatID);

    return url.toString().replace(url.origin, "");
  };

  return (
    <Paper
      component="section"
      id="chats-list"
      variant="outlined"
      sx={({ breakpoints }) => ({
        p: 0,
        height: laptopUp ? "100%" : "100vh",
        overflowY: "hidden",

        [breakpoints.up("sm")]: {
          minWidth: 320
        }
      })}
    >
      <Typography variant="h5" component="h1" sx={{ px: 2, mt: 2 }}>
        Chats
      </Typography>
      <Stack direction="row" width="100%" mt={3}>
        <List sx={{ width: "100%" }}>
          {chats?.map((chat) => (
            <ListItemButton
              key={chat.chatID}
              component={Link}
              to={
                laptopUp
                  ? getChatPathForDesktop(chat.chatID)
                  : `/chat/${chat.chatID}`
              }
              sx={{
                mb: 2,
                alignItems: "flex-start",
                bgcolor: ({ palette }) =>
                  selected === chat.chatID
                    ? alpha(palette.primary.light, 0.1)
                    : undefined
              }}
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
            </ListItemButton>
          ))}
        </List>
      </Stack>
    </Paper>
  );
};

export default ChatsList;
