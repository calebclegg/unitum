import "@fontsource/merriweather/400.css";
import Person from "@mui/icons-material/Person";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/system/Box";
import { styled, Theme } from "@mui/material/styles";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import topWave from "../images/wave-bg.svg";
import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/Contact";
import bottomWave from "../images/bottom-wave.svg";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const navLinks = [
  {
    label: "About Unitum",
    path: "#about-us"
  },
  {
    label: "Contact Us",
    path: "#contact-us"
  }
];

const TopWave = styled("img")`
  width: 65%;
  position: absolute;
  right: 0;
  z-index: -1;
`;

const BottomWave = styled("img")`
  width: 40%;
  position: absolute;
  bottom: 0;
  z-index: -1;
`;

export const Landing = () => {
  const xlUp = useMediaQuery("@media(min-width: 425px)");
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );

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
            <Logo full={tabletUp} />
            <Stack
              spacing={tabletUp ? 5 : 2}
              direction="row"
              alignItems="center"
            >
              {xlUp &&
                navLinks.map(({ label, path }) => (
                  <MuiLink
                    key={label}
                    color={({ customPalette }) => customPalette.navyBlue}
                    component={Link}
                    to={path}
                    fontSize={tabletUp ? undefined : 14}
                  >
                    {label}
                  </MuiLink>
                ))}
              <Button
                to="/login"
                color="secondary"
                component={Link}
                startIcon={tabletUp ? <Person /> : undefined}
              >
                Login
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Box width="100%" position="absolute" aria-hidden>
        <TopWave src={topWave} alt="" loading="lazy" />
      </Box>
      <Container id="main-content" component="main">
        <Hero />
        <About />
        <Contact />
      </Container>
      <Box position="relative" aria-hidden>
        <BottomWave src={bottomWave} alt="" loading="lazy" />
      </Box>
      <Footer />
    </>
  );
};

export default Landing;
