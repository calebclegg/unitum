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
import { useDisplaySize, useUser } from "../hooks";
import { useRef, useState } from "react";
import { Avatar, Paper, Typography } from "@mui/material";
import CommunitiesBrief from "./CommunitiesBrief";

const Sidebar = () => {
  const { user } = useUser();

  const desktopUp = useDisplaySize("lg");

  return (
    <Drawer
      variant={desktopUp ? "permanent" : "temporary"}
      sx={{
        width: desktopUp ? 284 : 0,
        overflowY: "hidden"
      }}
      PaperProps={{
        variant: "elevation",
        sx: {
          bottom: 0,
          height: desktopUp ? "calc(100% - 64px)" : undefined,
          overflowY: "hidden",
          width: 284,
          top: "unset",
          borderRadius: 0,
          position: "fixed",
          px: 5,
          zIndex: ({ zIndex }) => zIndex.drawer
        }
      }}
    >
      <Paper
        sx={{
          boxShadow:
            "0px 100px 80px rgba(153, 165, 236, 0.05), 0px 64.8148px 46.8519px rgba(153, 165, 236, 0.037963), 0px 38.5185px 25.4815px rgba(153, 165, 236, 0.0303704), 0px 20px 13px rgba(153, 165, 236, 0.025), 0px 8.14815px 6.51852px rgba(153, 165, 236, 0.0196296), 0px 1.85185px 3.14815px rgba(153, 165, 236, 0.012037)",

          border: "1.05172px solid #F0EFF5"
        }}
      >
        <Stack
          direction="column"
          alignItems={"center"}
          spacing={2}
          sx={{ p: 0.5 }}
        >
          <Avatar
            src={user?.profile.picture}
            // alt={user?.profile.fullName}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          />
          <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
            {user?.profile.fullName}
          </Typography>
        </Stack>
      </Paper>
      <Paper sx={{ p: 0.5, mt: 5 }}>
        <Stack direction="column" spacing={2}>
          <CommunitiesBrief />
        </Stack>
      </Paper>
    </Drawer>
  );
};

export default Sidebar;
