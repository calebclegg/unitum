import "@fontsource/merriweather/400.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { lighten } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { socialLinks } from "./link-lists";
import { useDisplaySize } from "../../hooks";
import hero from "../../images/hero-image.svg";

export const Hero = () => {
  const tabletUp = useDisplaySize("sm");

  return (
    <>
      <Stack
        component="section"
        id="hero"
        direction={tabletUp ? "row" : "column-reverse"}
        alignItems="center"
        spacing={tabletUp ? undefined : 4}
        justifyContent={tabletUp ? "space-between" : "center"}
        minHeight="100vh"
        sx={({ breakpoints }) => ({
          "& img": {
            width: "100%",

            [breakpoints.up("sm")]: {
              width: "55%"
            }
          }
        })}
      >
        <Stack
          spacing={4}
          component="section"
          id="intro"
          alignItems={tabletUp ? undefined : "center"}
          width={tabletUp ? "35%" : "100%"}
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            align={tabletUp ? undefined : "center"}
            data-aos="fade-up"
            data-aos-duration="400"
          >
            Education Made Easy
          </Typography>
          <Typography
            color="secondary"
            variant="h6"
            component="p"
            data-aos="fade-up"
            data-aos-duration="400"
            align={tabletUp ? undefined : "center"}
          >
            Unitum is here to support you through your academic journey
          </Typography>
          <div>
            <Button
              to="/register"
              component={Link}
              color="secondary"
              sx={{ textTransform: "uppercase" }}
            >
              Get Started
            </Button>
          </div>
          <Stack spacing={1.5} direction="row">
            {socialLinks.map(({ icon, href, label }) => (
              <IconButton
                data-aos="fade-right"
                data-aos-duration="400"
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
    </>
  );
};

export default Hero;
