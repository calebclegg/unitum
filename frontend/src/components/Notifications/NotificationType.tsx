import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

interface IProps {
  type: "like" | "comment" | "post";
  username: string;
  post: string;
  community: string;
  createdAt: string;
}

const NotificationType = ({
  type,
  username,
  post,
  createdAt,
  community
}: Partial<IProps>) => {
  if (!type) return null;

  const typeMessage = {
    like: (
      <>
        <strong>{username}</strong> liked your post &ldquo;
        <strong>{post}</strong>
        &rdquo;
      </>
    ),
    comment: (
      <>
        <strong>{username}</strong> commented on your post &ldquo;
        <strong>{post}</strong>
        &rdquo;
      </>
    ),
    post: (
      <>
        <strong>{username}</strong> posted &ldquo;
        <strong>{post}</strong>
        &rdquo; {community ? `in ${community}` : null}
      </>
    )
  };

  return (
    <ListItem
      sx={{
        p: 0,
        mb: 1,
        bgcolor: ({ palette }) => alpha(palette.primary.light, 0.1)
      }}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography
            variant="body2"
            sx={{
              px: 1
            }}
          >
            <strong>{username}</strong> {typeMessage[type]} &ldquo;
            <strong>{post}</strong>
            &rdquo;
          </Typography>
        }
        secondary={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1
            }}
          >
            <Typography variant="caption" color="grey.600">
              {createdAt}
            </Typography>
            <Button variant="text" size="small">
              Mark as read
            </Button>
          </Stack>
        }
      />
    </ListItem>
  );
};

export default NotificationType;
