import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

interface IProps {
  secondaryTextEl: HTMLParagraphElement | null;
}

const MessagesList = ({ secondaryTextEl }: IProps) => {
  return (
    <>
      <List sx={{ py: 0 }}>
        <ListItem
          sx={{
            p: 0,
            mb: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            bgcolor: ({ palette }) => alpha(palette.primary.light, 0.1)
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            width="100%"
            px={1}
            pt={0.5}
          >
            <ListItemAvatar>
              <Avatar>U</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="John Doe"
              secondary={
                <>
                  <strong>Hello World</strong> <em>and 2 other messages</em>
                </>
              }
              primaryTypographyProps={{ color: "#212121" }}
              secondaryTypographyProps={{
                color: "grey.700"
              }}
              sx={{ mb: 0, width: "100%" }}
            />
          </Stack>
          <Stack
            px={1}
            pb={0.5}
            width="100%"
            direction="row"
            justifyContent="flex-end"
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width={secondaryTextEl?.getBoundingClientRect().width}
            >
              <Typography variant="caption" color="grey.500">
                18 minutes ago
              </Typography>
              <Button size="small" variant="text">
                Mark as read
              </Button>
            </Stack>
          </Stack>
        </ListItem>
      </List>
      <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
        Older Messages
      </Typography>
      <List sx={{ py: 0 }}>
        <ListItem
          sx={{
            p: 0,
            mb: 1,
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start"
          }}
        >
          <Stack direction="row" alignItems="center" px={1} pt={0.5}>
            <ListItemAvatar>
              <Avatar>U</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="John Doe"
              secondary={
                <>
                  <strong>Hello World</strong> <em>and 2 other messages</em>
                </>
              }
              primaryTypographyProps={{ color: "#212121" }}
              secondaryTypographyProps={{ color: "grey.700" }}
              sx={{ mb: 0 }}
            />
          </Stack>
          <Stack
            px={1}
            pb={0.5}
            width="100%"
            direction="row"
            justifyContent="flex-end"
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width={secondaryTextEl?.getBoundingClientRect().width}
            >
              <Typography variant="caption" color="grey.500">
                Earlier today
              </Typography>
              <Button size="small" variant="text" sx={{ visibility: "hidden" }}>
                Mark as read
              </Button>
            </Stack>
          </Stack>
        </ListItem>
      </List>
    </>
  );
};

export default MessagesList;
