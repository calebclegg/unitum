import "@fontsource/inter";
import Link from "@mui/material/Link";
import CssBaseline from "@mui/material/CssBaseline";
import { visuallyHidden } from "@mui/utils";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./context/Auth";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";
import AOS from "aos";
import "aos/dist/aos.css";
import SocketProvider from "./context/Socket";

const Chat = lazy(() => import("./pages/Chat"));
const Feed = lazy(() => import("./pages/Feed"));
const Post = lazy(() => import("./pages/Post"));
const Community = lazy(() => import("./pages/Community"));
const Communities = lazy(() => import("./pages/Communities"));
const Search = lazy(() => import("./pages/Search"));
const Profile = lazy(() => import("./pages/Profile"));
const Notification = lazy(() => import("./pages/Notification"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  useEffect(() => {
    AOS.init();
  });

  return (
    <>
      <CssBaseline />
      <Link
        href="#main-content"
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          bgcolor: "primary.main",
          color: "grey.100",
          px: 3,
          py: 1.5,

          "&:not(:focus)": visuallyHidden,
          "&:focus": {
            zIndex: ({ zIndex }) => zIndex.tooltip,
            outline: ({ customPalette }) =>
              `3px solid ${customPalette.navyBlue}`,
            outlineOffset: 2
          }
        }}
      >
        Skip to main content
      </Link>
      <Suspense fallback="Loading">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/*"
            element={
              <Auth>
                <SocketProvider />
              </Auth>
            }
          >
            <Route path="/*" element={<Layout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="feed" element={<Feed />} />
              <Route path="posts/:post_id" element={<Post />} />
              <Route path="communities">
                <Route index element={<Communities />} />
                <Route path=":comm_id" element={<Community />} />
              </Route>
              <Route path="search" element={<Search />} />
              <Route path="notifications" element={<Notification />} />
            </Route>
            <Route path="chat/*" element={<Chat />} />
          </Route>
          <Route path="login/*" element={<Login />} />
          <Route path="register/*" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
