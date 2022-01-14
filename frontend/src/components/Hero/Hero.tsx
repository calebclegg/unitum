import "@fontsource/merriweather/400.css";
import {
  Button,
  Container,
  IconButton,
  lighten,
  Stack,
  styled,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { socialLinks } from "./link-lists";
import wave from "../../images/wave-bg.svg";
import hero from "../../images/hero-image.svg";

const Image = styled("img")`
  width: 65%;
  position: absolute;
  right: 0;
`;

export const Hero = () => {
  return (
    <>
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

export default Hero;
