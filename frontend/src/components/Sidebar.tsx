import { NavLink, useLocation } from "react-router-dom";
import Add from "@mui/icons-material/Add";
import Bookmarks from "@mui/icons-material/Bookmarks";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Feed from "@mui/icons-material/Feed";
import Group from "@mui/icons-material/Group";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import Person from "@mui/icons-material/Person";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import { alpha } from "@mui/material/styles";
import { useDisplaySize } from "../hooks";

const navLinks = [
  {
    path: "/feed",
    label: "Feed",
    icon: <Feed />
  },
  {
    path: "/chat",
    label: "Chat",
    icon: <QuestionAnswer />
  },
  {
    path: "/profile#posts",
    label: "My Posts",
    icon: <Person />
  },
  {
    path: "/profile#saved",
    label: "Saved Posts",
    icon: <Bookmarks />
  },
  {
    path: "/communities",
    label: "Communities",
    icon: <Group />
  }
];

interface IProps {
  open: boolean;
  handleClose: () => void;
}

const Sidebar = ({ open, handleClose }: IProps) => {
  const { pathname } = useLocation();
  const desktopUp = useDisplaySize("lg");

  return (
    <Drawer
      open={open}
      variant={desktopUp ? "permanent" : "temporary"}
      onClose={handleClose}
      sx={{
        transition: ({ transitions }) =>
          transitions.create("width", {
            duration:
              transitions.duration[open ? "enteringScreen" : "leavingScreen"],
            easing: "cubic-bezier(0, 0, 0.2, 1)"
          }),
        width: desktopUp ? 318 : 0
      }}
      PaperProps={{
        sx: {
          bottom: 0,
          height: desktopUp ? "calc(100% - 64px)" : undefined,
          width: 318,
          top: "unset",
          borderRadius: 0,
          position: "fixed",
          zIndex: ({ zIndex }) => zIndex.drawer
        }
      }}
    >
      {!desktopUp && (
        <Stack direction="row" justifyContent="flex-end">
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      )}
      <Box p={6}>
        <Button
          fullWidth
          color="primary"
          startIcon={<Add />}
          href="#create-post"
          sx={{ mb: 4 }}
        >
          Create Post
        </Button>
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navLinks.map(({ path, icon, label }) => (
            <ListItem
              key={path}
              component={NavLink}
              to={path}
              sx={({ palette }) => ({
                bgcolor:
                  path === pathname
                    ? alpha(palette.primary.light, 0.18)
                    : undefined,
                borderRadius: 1,

                "& svg, & span": {
                  color: path === pathname ? palette.primary.main : undefined
                },

                "&:hover, &:focus": {
                  outline: "2px solid",
                  outlineColor:
                    path === pathname
                      ? palette.primary.main
                      : palette.text.primary
                }
              })}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>
                {label}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
