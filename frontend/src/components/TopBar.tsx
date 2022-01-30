import { styled, Theme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Email from "@mui/icons-material/Email";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";
import Menu from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Box from "@mui/system/Box";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Logo from "./Logo";
import { darkTheme } from "../lib";
import { useDisplaySize } from "../hooks";
import { Link, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { useUser } from "../hooks";
import { useSocket } from "../context/Socket";

const Search = lazy(() => import("./Search"));
const MobileInput = lazy(() => import("./Search/MobileInput"));
const MenuOptions = lazy(() => import("./MenuOptions"));
const Notifications = lazy(() => import("./Notifications"));

const MenuButton = styled("button")(({ theme }) => ({
  padding: theme.spacing(0.4, 1),
  border: "none",
  borderRadius: theme.spacing(0.5),
  cursor: "pointer",
  width: "fit-content",
  backgroundColor: "transparent",

  "&:focus": {
    outline: `2px solid ${theme.palette.grey[500]}`
  }
}));

interface IProps {
  openDrawer: () => void;
}

const TopBar = ({ openDrawer }: IProps) => {
  const { user } = useUser();
  const { socket } = useSocket();
  const { pathname } = useLocation();
  const tabletUp = useDisplaySize("sm");
  const laptopUp = useDisplaySize("md");
  const tabletLaptop = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.between("sm", "lg")
  );
  const tablet = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.only("sm")
  );

  const [notifications, setNotifications] = useState(0);
  const [searchMode, setSearchMode] = useState(false);
  const [menuButton, setMenuButton] = useState<HTMLButtonElement | null>(null);
  const [notificationButton, setNotificationButton] =
    useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setSearchMode(pathname === "/search");
  }, [pathname]);

  useEffect(() => {
    if (socket) {
      socket.on("notification:get", (notifications) => {
        setNotifications(notifications.length);
      });
    }
  }, [socket]);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setMenuButton(event.currentTarget);

  const closeMenu = () => setMenuButton(null);

  const setNotificationAnchor = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    setNotificationButton(
      (event as React.MouseEvent<HTMLButtonElement>).currentTarget
    );
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar
          elevation={0}
          sx={{
            p: 0,
            borderRadius: 0,
            bgcolor: ({ customPalette }) => customPalette.navyBlue
          }}
        >
          <Container maxWidth="xl" disableGutters={!tabletUp}>
            <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
              {(!searchMode || tabletUp) && (
                <Stack direction="row">
                  {tabletLaptop && (
                    <IconButton
                      onClick={openDrawer}
                      aria-label="open sidebar"
                      sx={{ color: "text.secondary" }}
                    >
                      <Menu />
                    </IconButton>
                  )}
                  <Logo full />
                </Stack>
              )}
              {!searchMode && (
                <>
                  {laptopUp && (
                    <Suspense fallback={<div />}>
                      <Search />
                    </Suspense>
                  )}
                  <Stack
                    direction="row"
                    spacing={tabletUp ? 2 : 1}
                    alignItems="center"
                  >
                    {tablet && (
                      <IconButton
                        component={Link}
                        aria-label="search"
                        to="/search"
                        sx={{ color: "text.secondary" }}
                      >
                        <SearchIcon />
                      </IconButton>
                    )}
                    <IconButton
                      component={Link}
                      aria-label="notifications"
                      onClick={setNotificationAnchor}
                      to={tabletUp ? "#notifications" : "/notifications"}
                      sx={{ color: "text.secondary" }}
                    >
                      <Badge
                        color="error"
                        variant="dot"
                        overlap="circular"
                        badgeContent={notifications}
                      >
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    {tabletUp && (
                      <IconButton
                        aria-label="messages"
                        component={Link}
                        to={tabletUp ? "#messages" : "/messages"}
                        sx={{ color: "text.secondary" }}
                      >
                        <Badge
                          color="error"
                          variant="dot"
                          overlap="circular"
                          badgeContent={5}
                        >
                          <Email />
                        </Badge>
                      </IconButton>
                    )}
                    {tabletUp ? (
                      <ButtonUnstyled component={MenuButton} onClick={openMenu}>
                        <Grid container spacing={1.5} alignItems="center">
                          <Grid item>
                            <Avatar sx={{ width: 50, height: 50 }}>U</Avatar>
                          </Grid>
                          <Grid
                            item
                            container
                            width="fit-content"
                            direction="column"
                            alignItems="center"
                            gap={0.25}
                          >
                            <Typography color="text.primary">
                              {user?.profile.fullName}
                            </Typography>
                            <Chip
                              size="small"
                              label={`unicoyn ${user?.profile.unicoyn || 0}`}
                              sx={({ customPalette }) => ({
                                height: 20,
                                borderRadius: 0.5,
                                bgcolor: "grey.300",
                                color: customPalette.navyBlue
                              })}
                            />
                          </Grid>
                        </Grid>
                      </ButtonUnstyled>
                    ) : (
                      <IconButton aria-label="menu" onClick={openMenu}>
                        <Avatar sx={{ width: 50, height: 50 }}>U</Avatar>
                      </IconButton>
                    )}
                  </Stack>
                </>
              )}
              {searchMode && (
                <Suspense fallback={<div />}>
                  <Box width="100%">
                    <MobileInput />
                  </Box>
                </Suspense>
              )}
            </Toolbar>
          </Container>
          <Suspense fallback={<div />}>
            <Notifications anchorEl={notificationButton} />
          </Suspense>
          <Suspense fallback={<div />}>
            <MenuOptions anchorEl={menuButton} handleClose={closeMenu} />
          </Suspense>
        </AppBar>
      </ThemeProvider>
    </>
  );
};

export default TopBar;
