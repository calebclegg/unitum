import { Link, Route, Routes } from "react-router-dom";
import Helmet from "react-helmet";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
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
  const tablet = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.only("sm")
  );
  const numberOfMessages = chats?.reduce(
    (acc, curr) => acc + curr.numberOfUnreadMessages,
    0
  );

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.history.length > 2) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {chatID
            ? `${
                currentChat?.recipient.profile.fullName || "Loading..."
              } | Chat`
            : `${numberOfMessages || 0} unread messages`}
        </title>
      </Helmet>
      <Dialog
        open
        fullScreen
        id="chats"
        PaperProps={{ sx: { p: 0, bgcolor: "background.default" } }}
        sx={{
          "& main": {
            overflowY: "hidden"
          }
        }}
      >
        <Stack
          p={2}
          mb={2}
          bgcolor="#fff"
          borderBottom="2px solid"
          borderColor="divider"
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
          {!tablet && currentChat ? (
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
          {tablet ? (
            <Stack direction="row">
              <ChatsList selected={currentChat?.chatID} />
              <Routes>
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
            </Stack>
          ) : (
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
          )}
        </main>
      </Dialog>
    </>
  );
};

export default Chat;
