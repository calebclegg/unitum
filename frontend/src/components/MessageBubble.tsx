import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// import Visibility from "@mui/icons-material/Visibility";

interface IProps {
  message: string;
  from: "me" | "recipient";
  //   seen: boolean;
  time: string;
}

const MessageBubble = ({
  message,
  from,
  /*  seen, */ time
}: Partial<IProps>) => {
  return (
    <Stack
      px={2}
      mt={2}
      spacing={0.4}
      alignItems={from === "me" ? "flex-end" : "flex-start"}
    >
      <Paper sx={{ bgcolor: from === "me" ? "#fff" : "lightblue" }}>
        <Typography variant="body2">{message}</Typography>
      </Paper>
      <Stack direction="row" justifyContent="space-between">
        {/* {seen ? <Visibility color="action" /> : null} */}
        {time ? (
          <Typography variant="caption">
            {new Date(time).toDateString()}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default MessageBubble;
