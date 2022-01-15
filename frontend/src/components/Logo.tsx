import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import logo from "../images/logo.png";

const Logo = () => {
  return (
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
  );
};

export default Logo;
