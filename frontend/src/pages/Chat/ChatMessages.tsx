import LoadingButton from "@mui/lab/LoadingButton";
import AttachFile from "@mui/icons-material/AttachFile";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { useEffect, useState } from "react";
import { useData } from "../../hooks";
import { useParams } from "react-router-dom";
import { IChat } from "./ChatsList";
import MessageBubble from "../../components/MessageBubble";

interface IMessage {
  _id: string;
  createdAt: string;
  from: "recipient" | "me";
  read: false;
  text: string;
}

type TProps = Pick<IChat, "numberOfUnreadMessages"> & {
  setChatID: React.Dispatch<React.SetStateAction<string>>;
};

const ChatMessages = ({ numberOfUnreadMessages, setChatID }: TProps) => {
  const { chat_id } = useParams<{ chat_id: string }>();
  const [sending, setSending] = useState(false);
  const { data: messages } = useData<IMessage[]>(`chat/${chat_id}`);

  useEffect(() => {
    if (chat_id) setChatID(chat_id);
    return () => setChatID("");
  }, [chat_id]);

  const readMessages = messages?.filter(({ read }) => read);
  const unreadMessages = messages?.filter(({ read }) => !read);

  const handleSubmit = async () => {
    try {
      setSending(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box width="100%" position="relative">
      <Box p={2}>
        {readMessages?.map(({ _id, from, text, createdAt }) => (
          <MessageBubble
            key={_id}
            from={from}
            message={text}
            time={createdAt}
          />
        ))}
        <Divider variant="middle" color="red" sx={{ my: 2 }} />
        <Typography
          align="center"
          sx={{
            bgcolor: "primary.light",
            px: 2,
            py: 1,
            width: "fit-content",
            borderRadius: 4,
            mx: "auto",
            mb: 4
          }}
          variant="body2"
          component="div"
        >
          {numberOfUnreadMessages} unread Messages
        </Typography>
        {unreadMessages?.map(({ _id, from, text, createdAt }) => (
          <MessageBubble
            key={_id}
            from={from}
            message={text}
            time={createdAt}
          />
        ))}
      </Box>
      <Paper
        square
        variant="outlined"
        sx={{
          py: 1.5,
          px: 1,
          position: "absolute",
          bottom: 90,
          width: "100%",
          "& form": { width: "100%" }
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            width="inherit"
          >
            <IconButton>
              <AttachFile />
            </IconButton>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="message-input"
                name="message"
                sx={{ bgcolor: "grey.100" }}
                inputProps={{
                  required: true,
                  placeholder: "Type message here",
                  "aria-label": "message"
                }}
              />
            </FormControl>
            <LoadingButton variant="contained" loading={sending}>
              Send
            </LoadingButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ChatMessages;
