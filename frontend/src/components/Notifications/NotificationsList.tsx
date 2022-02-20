import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationType from "./NotificationType";
import { useUser } from "../../hooks";

const NotificationsList = () => {
  const { notifications } = useUser();

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">
          <strong>{notifications?.length || 0}</strong> unread messages
        </Typography>
        <Button variant="text" sx={{ textDecoration: "underline" }}>
          Mark all as read
        </Button>
      </Stack>
      <List>
        {notifications?.map(({ _id, user, post, type, createdAt }) => (
          <NotificationType
            key={_id}
            type={type}
            createdAt={createdAt}
            username={user.profile.fullName}
            post={post.body.split(" ").slice(0, 8).join(" ")}
          />
        ))}
      </List>
    </>
  );
};

export default NotificationsList;
