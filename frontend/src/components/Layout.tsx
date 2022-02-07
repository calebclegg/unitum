import { lazy, Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import BottomNav from "./BottomNav";
import TopBar from "./TopBar";
import SocketProvider from "../context/Socket";
import CommunitiesBrief from "./CommunitiesBrief";

const Sidebar = lazy(() => import("./Sidebar"));
const CreatePost = lazy(() => import("./CreatePost"));

const Layout = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );
  const desktopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("lg")
  );

  const openDrawer = () => setIsDrawerOpened(true);
  const closeDrawer = () => setIsDrawerOpened(false);

  return (
    <SocketProvider>
      <TopBar openDrawer={openDrawer} />
      <Stack direction="row" spacing={4}>
        <Suspense fallback={<div />}>
          <Sidebar open={isDrawerOpened} handleClose={closeDrawer} />
        </Suspense>
        <Container
          component="main"
          id="main-content"
          disableGutters={desktopUp}
          sx={{ pt: 11, width: "min(800px, 100%)", maxWidth: 800 }}
        >
          <Outlet />
        </Container>
        {tabletUp && <CommunitiesBrief />}
      </Stack>
      {!tabletUp && <BottomNav />}
      <CreatePost />
    </SocketProvider>
  );
};

export default Layout;
