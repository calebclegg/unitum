import { lazy, Suspense, useState } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import Box from "@mui/system/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import BottomNav from "./BottomNav";
import TopBar from "./TopBar";
import CommunitiesBrief from "./CommunitiesBrief";
import AboutCommunity from "./AboutCommunity";

const Sidebar = lazy(() => import("./Sidebar"));
const ChatDialog = lazy(() => import("./ChatDialog"));
const CreatePost = lazy(() => import("./CreatePost"));

const Layout = () => {
  const params = useParams<Record<string, string>>();
  const { pathname } = useLocation();
  const communityPage = Object.keys(params).includes("comm_id");
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );
  const desktopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("lg")
  );
  const tabletLaptop = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.between("sm", "lg")
  );

  const openDrawer = () => setIsDrawerOpened(true);
  const closeDrawer = () => setIsDrawerOpened(false);

  return (
    <>
      <TopBar openDrawer={openDrawer} />
      <Stack direction="row" spacing={2}>
        <Suspense fallback={<div />}>
          <Sidebar />
        </Suspense>
        <Container
          component="main"
          id="main-content"
          disableGutters={desktopUp}
          sx={{ py: 11, width: "100%" }}
        >
          <Outlet />
        </Container>
        {tabletUp && (
          <Box
            position="relative"
            top={0}
            flexGrow={1}
            display={tabletLaptop ? "none" : undefined}
            visibility={
              pathname !== "/feed" && !pathname.includes("/communities")
                ? "hidden"
                : "visible"
            }
            ml={tabletLaptop ? "0 !important" : undefined}
          >
            <Paper
              id={communityPage ? "about-community" : "communities"}
              component="aside"
              sx={{
                mt: 11,
                position: "sticky",
                top: ({ spacing }) => spacing(11),

                mr: 10
              }}
            >
              {communityPage ? <AboutCommunity /> : <CommunitiesBrief />}
            </Paper>
          </Box>
        )}
      </Stack>
      {!tabletUp && <BottomNav />}
      <CreatePost />
      <Suspense fallback={<div />}>
        <ChatDialog />
      </Suspense>
    </>
  );
};

export default Layout;
