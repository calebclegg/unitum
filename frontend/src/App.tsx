import "@fontsource/inter";
import Feed from "./pages/Feed";
import { Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { lazy, Suspense } from "react";
import Landing from "./pages/Landing";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <>
      <CssBaseline />
      <Suspense fallback="Loading">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="feed/*" element={<Feed />} />
          <Route path="login/*" element={<Login />} />
          <Route path="register/*" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
