import { styled, Theme, ThemeProvider } from "@mui/material/styles";
import Email from "@mui/icons-material/Email";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";
import Menu from "@mui/icons-material/Menu";
import Notifications from "@mui/icons-material/Notifications";
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
import { Link } from "react-router-dom";
import { lazy, Suspense, useState } from "react";

const Search = lazy(() => import("./Search"));
const MenuOptions = lazy(() => import("./MenuOptions"));

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
  const tabletUp = useDisplaySize("sm");
  const laptopUp = useDisplaySize("md");
  const tabletLaptop = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.between("sm", "lg")
  );

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const closeMenu = () => setAnchorEl(null);

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
            <Toolbar sx={{ justifyContent: "space-between" }}>
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
                <IconButton
                  component={Link}
                  aria-label="notifications"
                  to={tabletUp ? "#notifications" : "/notifications"}
                  sx={{ color: "text.secondary" }}
                >
                  <Badge
                    color="error"
                    variant="dot"
                    overlap="circular"
                    badgeContent={5}
                  >
                    <Notifications />
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
                        <Typography color="text.primary">John Doe</Typography>
                        <Chip
                          size="small"
                          label="Student"
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
            </Toolbar>
          </Container>
          <Suspense fallback={<div />}>
            <MenuOptions anchorEl={anchorEl} handleClose={closeMenu} />
          </Suspense>
        </AppBar>
      </ThemeProvider>
    </>
  );
};

export default TopBar;
