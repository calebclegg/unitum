import "@fontsource/inter";
import Link from "@mui/material/Link";
import CssBaseline from "@mui/material/CssBaseline";
import { visuallyHidden } from "@mui/utils";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";

const Feed = lazy(() => import("./pages/Feed"));
const Search = lazy(() => import("./pages/Search"));
const Notification = lazy(() => import("./pages/Notification"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
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
          <Route path="/*" element={<Layout />}>
            <Route path="feed" element={<Feed />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notification />} />
          </Route>
          <Route path="login/*" element={<Login />} />
          <Route path="register/*" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
