import { NavLink, useLocation, useParams } from "react-router-dom";
import Add from "@mui/icons-material/Add";
import Bookmarks from "@mui/icons-material/Bookmarks";
import Close from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import { useRef, useState } from "react";

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
    path: "/profile?tab=my-posts",
    label: "My Posts",
    icon: <Person />
  },
  {
    path: "/profile?tab=saved-posts",
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
  const params = useParams();
  const anchorRef = useRef<HTMLDivElement>(null);
  const desktopUp = useDisplaySize("lg");
  const [isCreateMenuOpened, setIsCreateMenuOpened] = useState(false);

  const handleToggle = () => setIsCreateMenuOpened(!isCreateMenuOpened);

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
        {pathname.includes("/communities") && Object.keys(params).length ? (
          <Button
            fullWidth
            color="primary"
            startIcon={<Add />}
            href="#create-post"
            sx={{ mb: 4 }}
          >
            Create Post
          </Button>
        ) : (
          <ButtonGroup
            fullWidth
            disableElevation
            variant="contained"
            ref={anchorRef}
            aria-label="Create post"
            sx={{ mb: 4 }}
          >
            <Button
              color="primary"
              startIcon={<Add />}
              href="#create-post"
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: "1px solid",
                borderColor: "divider"
              }}
            >
              Create Post
            </Button>
            <Button
              size="small"
              aria-controls={
                isCreateMenuOpened ? "split-button-menu" : undefined
              }
              aria-expanded={isCreateMenuOpened ? "true" : undefined}
              aria-label="select create option"
              aria-haspopup="menu"
              onClick={handleToggle}
              sx={{
                width: "initial",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
        )}
        <Menu
          id="split-button-menu"
          open={isCreateMenuOpened}
          anchorEl={anchorRef.current}
          onClose={handleToggle}
          PaperProps={{ sx: { p: 0 } }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <MenuItem component="a" href="#create-post">
            Create a post
          </MenuItem>
          <MenuItem component="a" href="#upload-school-work">
            Add a school work
          </MenuItem>
        </Menu>
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navLinks.map(({ path, icon, label }) => (
            <ListItem
              key={path}
              component={NavLink}
              to={path}
              onClick={handleClose}
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
