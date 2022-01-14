import "@fontsource/merriweather/400.css";
import Person from "@mui/icons-material/Person";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import wave from "../images/wave-bg.svg";
import Hero from "../components/Hero";
import About from "../components/About";

const navLinks = [
  {
    label: "About Unitum",
    path: "/about"
  },
  {
    label: "Contact Us",
    path: "/contact"
  }
];

const Image = styled("img")`
  width: 65%;
  position: absolute;
  right: 0;
`;

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
      <AppBar position="absolute" elevation={0} color="transparent">
        <Container>
          <Toolbar
            variant="dense"
            sx={{ px: "0 !important", justifyContent: "space-between" }}
          >
            <Stack
              px={1.6}
              spacing={0.5}
              direction="row"
              alignItems="center"
              borderRadius={1}
              bgcolor={({ customPalette }) => customPalette.navyBlue}
            >
              <img src={logo} alt="" width="30" height="40" loading="lazy" />
              <Typography
                color="grey.100"
                variant="h6"
                component="span"
                fontFamily="'Merriweather', Times new Roman"
              >
                UNITUM
              </Typography>
            </Stack>
            <Stack spacing={5} direction="row" alignItems="center">
              {navLinks.map(({ label, path }) => (
                <MuiLink
                  key={label}
                  color={({ customPalette }) => customPalette.navyBlue}
                  component={Link}
                  to={path}
                >
                  {label}
                </MuiLink>
              ))}
              <Button
                to="/login"
                color="secondary"
                component={Link}
                startIcon={<Person />}
              >
                Login
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Box width="100%" position="absolute" zIndex={-1}>
        <Image src={wave} alt="" loading="lazy" />
      </Box>
      <Container>
        <Hero />
        <About />
      </Container>
    </>
  );
};

export default Landing;
