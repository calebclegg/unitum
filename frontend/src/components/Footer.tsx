import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { socialLinks } from "./Hero/link-lists";
import { useDisplaySize } from "../hooks";
import Logo from "./Logo";

const Footer = () => {
  const { customPalette } = useTheme();
  const tabletUp = useDisplaySize("sm");

  return (
    <Box py={8} component="footer" bgcolor={customPalette.navyBlue}>
      <Container>
        <Stack
          spacing={tabletUp ? undefined : 8}
          direction={tabletUp ? "row" : "column"}
          alignItems="center"
          justifyContent="space-between"
        >
          <Logo full />
          <Stack alignItems="center" spacing={4}>
            <Stack direction="row" gap={tabletUp ? 4 : 2}>
              <MuiLink
                component={Link}
                to="#about-us"
                variant="h6"
                color="grey.100"
              >
                About Unitum
              </MuiLink>
              <Divider
                flexItem
                orientation="vertical"
                sx={{ borderColor: "grey.100" }}
              />
              <MuiLink
                component={Link}
                to="#contact-us"
                variant="h6"
                color="grey.100"
              >
                Contact Us
              </MuiLink>
            </Stack>
            <Stack direction="row" gap={tabletUp ? 4 : 2}>
              <MuiLink component={Link} to="/about" sx={{ color: "grey.300" }}>
                &copy; UNITUM
              </MuiLink>
              <MuiLink component={Link} to="/terms" sx={{ color: "grey.300" }}>
                Terms
              </MuiLink>
              <MuiLink
                component={Link}
                to="/privacy"
                sx={{ color: "grey.300" }}
              >
                Privacy Policy
              </MuiLink>
            </Stack>
          </Stack>
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
                  border: "2px solid",
                  borderColor: ({ customPalette }) => customPalette.navyBlue,
                  transition: ({ transitions }) =>
                    transitions.create("border-color", {
                      duration: transitions.duration.shortest,
                      easing: transitions.easing.easeOut
                    }),

                  "&:hover, &:focus": {
                    borderColor: "silver"
                  }
                }}
              >
                {icon}
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
