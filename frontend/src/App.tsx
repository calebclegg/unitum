import "@fontsource/inter";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <>
      <CssBaseline />
      <Suspense fallback="Loading">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login/*" element={<Login />} />
          <Route path="register/*" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
