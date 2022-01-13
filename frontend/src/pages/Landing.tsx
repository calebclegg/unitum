import { AppBar, Button, Toolbar } from "@mui/material";
import { Helmet } from "react-helmet";

export const Landing = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Unitum is here to support you through your academic journey"
        />
        <title>Unitum</title>
      </Helmet>
      <AppBar elevation={0} color="transparent">
        <Toolbar>
          <Button color="secondary" variant="contained">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Landing;
