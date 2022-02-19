import { Link, Route, Routes } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ChatsList from "./ChatsList";
import ChatMessages from "./ChatMessages";
import { useData } from "../../hooks";
import { useState } from "react";

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

const Chat = () => {
  const [chatID, setChatID] = useState("");
  const { data: chats } = useData<IChat[]>("chat");
  const currentChat = chats?.find((chat) => chat.chatID === chatID);

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.history.length > 2) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <Dialog
      open
      fullScreen
      id="chats"
      PaperProps={{ sx: { p: 0, bgcolor: "background.default" } }}
    >
      <Stack
        p={2}
        mb={2}
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          component={Link}
          to="/feed"
          aria-label="go back"
          onClick={goBack}
        >
          <ArrowBack />
        </IconButton>
        {currentChat ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h4" component="h1">
              {currentChat.recipient.profile.fullName}
            </Typography>
            <Avatar
              variant="rounded"
              src={currentChat.recipient.profile.picture}
              alt={currentChat.recipient.profile.fullName}
            />
          </Stack>
        ) : null}
      </Stack>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<ChatsList />} />
          <Route
            path=":chat_id"
            element={
              <ChatMessages
                setChatID={setChatID}
                numberOfUnreadMessages={
                  currentChat?.numberOfUnreadMessages || 0
                }
              />
            }
          />
        </Routes>
      </main>
    </Dialog>
  );
};

export default Chat;
