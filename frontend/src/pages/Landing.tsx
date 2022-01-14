import "@fontsource/merriweather/400.css";
import {
  Facebook,
  Instagram,
  LinkedIn,
  Person,
  Twitter
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  lighten,
  Link as MuiLink,
  Stack,
  styled,
  Toolbar,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import wave from "../images/wave-bg.svg";
import hero from "../images/hero-image.svg";

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

const socialLinks = [
  {
    icon: <Facebook />,
    href: "",
    label: "facebook"
  },
  {
    icon: <Twitter />,
    href: "",
    label: "Twitter"
  },
  {
    icon: <Instagram />,
    href: "",
    label: "Instagram"
  },
  {
    icon: <LinkedIn />,
    href: "",
    label: "LinkedIn"
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
      <AppBar elevation={0} color="transparent">
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
      <Box width="100%" position="fixed" zIndex={-1}>
        <Image src={wave} alt="" loading="lazy" />
      </Box>
      <Container component="main">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          minHeight="100vh"
          sx={{
            "& img": {
              width: "55%"
            }
          }}
        >
          <Stack spacing={4} component="section" id="intro" width="35%">
            <Typography variant="h2" component="h1" fontWeight={700}>
              Education Made Easy
            </Typography>
            <Typography color="secondary" variant="h6" component="p">
              Unitum is here to support you through your academic journey
            </Typography>
            <div>
              <Button
                to="/about"
                component={Link}
                color="secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Learn More
              </Button>
            </div>
            <Stack spacing={1.5} direction="row">
              {socialLinks.map(({ icon, href, label }) => (
                <IconButton
                  key={href}
                  to={href}
                  component={Link}
                  aria-label={label}
                  sx={{
                    color: "grey.200",
                    bgcolor: ({ customPalette }) => customPalette.navyBlue,

                    "&:hover, &:focus": {
                      bgcolor: ({ customPalette }) =>
                        lighten(customPalette.navyBlue, 0.2)
                    }
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
          <img src={hero} alt="" loading="lazy" width="600" />
        </Stack>
      </Container>
    </>
  );
};

export default Landing;
