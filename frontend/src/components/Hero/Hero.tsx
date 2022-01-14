import "@fontsource/merriweather/400.css";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { lighten } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { socialLinks } from "./link-lists";
import hero from "../../images/hero-image.svg";

export const Hero = () => {
  return (
    <>
      <Container>
        <Stack
          component="section"
          id="hero"
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
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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

export default Hero;
