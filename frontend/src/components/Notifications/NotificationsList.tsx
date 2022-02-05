import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

const NotificationsList = () => {
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">
          <strong>2</strong> unread messages
        </Typography>
        <Button variant="text" sx={{ textDecoration: "underline" }}>
          Mark all as read
        </Button>
      </Stack>
      <List>
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
                  px: 1,

                  "& strong": {
                    fontWeight: 600
                  }
                }}
              >
                <strong>John Doe</strong> commented &ldquo;
                <strong>
                  This is incredible!!!{" "}
                  <span role="img" aria-label="surprised face">
                    😲
                  </span>
                </strong>
                &rdquo; on <strong>Lorem ipsum dolor sit...</strong>
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
                  18 minutes ago
                </Typography>
                <Button variant="text" size="small">
                  Mark as read
                </Button>
              </Stack>
            }
          />
        </ListItem>
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
                  px: 1,
                  "& strong": {
                    fontWeight: 600
                  }
                }}
              >
                <strong>John Doe</strong> posted &ldquo;
                <strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reiciendis, impedit?...
                </strong>
                &rdquo; to <strong>Data Warehouse</strong>
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
                  21 minutes ago
                </Typography>
                <Button variant="text" size="small">
                  Mark as read
                </Button>
              </Stack>
            }
          />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="body2"
                sx={{
                  px: 1
                }}
              >
                <strong>John Doe</strong> liked your comment &ldquo;
                <strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </strong>
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
                  18 minutes ago
                </Typography>
              </Stack>
            }
          />
        </ListItem>
      </List>
      <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
        Older Notifications
      </Typography>
      <List>
        <ListItem
          sx={{
            p: 0,
            mb: 1
          }}
        >
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="body2"
                sx={{
                  px: 1,

                  "& strong": {
                    fontWeight: 600
                  }
                }}
              >
                <strong>John Doe</strong> commented &ldquo;
                <strong>
                  This is incredible!!!{" "}
                  <span role="img" aria-label="surprised face">
                    😲
                  </span>
                </strong>
                &rdquo; on <strong>Lorem ipsum dolor sit...</strong>
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
                  18 minutes ago
                </Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem
          sx={{
            p: 0,
            mb: 1
          }}
        >
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="body2"
                sx={{
                  px: 1,
                  "& strong": {
                    fontWeight: 600
                  }
                }}
              >
                <strong>John Doe</strong> posted &ldquo;
                <strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reiciendis, impedit?...
                </strong>
                &rdquo; to <strong>Data Warehouse</strong>
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
                  21 minutes ago
                </Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="body2"
                sx={{
                  px: 1
                }}
              >
                <strong>John Doe</strong> liked your comment &ldquo;
                <strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </strong>
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
                  18 minutes ago
                </Typography>
              </Stack>
            }
          />
        </ListItem>
      </List>
      <LoadingButton
        size="small"
        loadingPosition="end"
        loading
        sx={{
          display: "flex",
          gap: 1.25,
          "& .MuiLoadingButton-loadingIndicator": { position: "relative" }
        }}
      >
        Load more
      </LoadingButton>
    </>
  );
};

export default NotificationsList;
