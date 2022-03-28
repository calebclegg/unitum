import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationType from "./NotificationType";
import { INotification, useUser } from "../../hooks";
import { API } from "../../lib";
import { useAuth } from "../../context/Auth";

const NotificationsList = () => {
  const { notifications } = useUser();
  console.log(notifications);
  const { token } = useAuth();
  const markAsRead = async (notificationId: string | undefined) => {
    await API.delete(`/users/me/notifications/${notificationId}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  };

  const markAllAsRead = async () => {
    await API.delete(`/users/me/notifications/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">
          <strong>{notifications?.length || 0}</strong> unread notifications
        </Typography>
        <Button
          variant="text"
          sx={{ textDecoration: "underline" }}
          onClick={markAllAsRead}
        >
          Mark all as read
        </Button>
      </Stack>
      <List>
        {notifications?.map(
          ({ _id, user, post, type, createdAt, community }) => (
            <NotificationType
              key={_id}
              type={type}
              notificationId={_id}
              createdAt={createdAt}
              username={user.profile.fullName}
              post={post?.body.split(" ").slice(0, 8).join(" ")}
              community={community?.name}
              markAsRead={markAsRead}
            />
          )
        )}
      </List>
    </>
  );
};

export default NotificationsList;
