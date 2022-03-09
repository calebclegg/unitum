import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import Helmet from "react-helmet";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ChatsList from "./ChatsList";
import ChatMessages from "./ChatMessages";
import { useData } from "../../hooks";
import { useEffect, useState } from "react";

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
  const { breakpoints } = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [chatID, setChatID] = useState("");
  const { data: chats } = useData<IChat[]>("chat");
  const currentChat = chats?.find((chat) => chat.chatID === chatID);
  const tabletLaptop = useMediaQuery(breakpoints.between("sm", "lg"));
  const laptopUp = useMediaQuery(breakpoints.up("lg"));

  const numberOfMessages = chats?.reduce(
    (acc, curr) => acc + curr.numberOfUnreadMessages,
    0
  );

  useEffect(() => {
    if (laptopUp) {
      const param = new URLSearchParams();
      param.set("chat_id", chatID);
      const navigationState = state as { previousPage: string } | undefined;

      const previousPage = navigationState
        ? new URL(navigationState.previousPage)
        : null;

      const newPath =
        previousPage?.origin === window.location.origin
          ? previousPage?.pathname
          : "/feed";

      navigate(
        chatID ? `${newPath}?${param.toString()}#chat` : `${newPath}#chat`,
        {
          replace: true
        }
      );
    }
  }, [laptopUp]);

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const previousURL = new URL(document.referrer);
    if (previousURL.origin === window.location.origin) {
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
        PaperProps={{
          sx: {
            p: 0,
            overflow: "hidden",
            bgcolor: chatID || tabletLaptop ? "background.default" : undefined
          }
        }}
      >
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
            to="/feed"
            aria-label="go back"
            onClick={goBack}
          >
            <ArrowBack />
          </IconButton>
          {!tabletLaptop && currentChat ? (
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
          {tabletLaptop ? (
            <Stack direction="row">
              <ChatsList selected={currentChat?.chatID} />
              <Routes>
                <Route
                  path=":chat_id"
                  element={
                    <ChatMessages
                      recipientID={currentChat?.recipient._id || ""}
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
                    recipientID={currentChat?.recipient._id || ""}
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
