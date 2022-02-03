import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import facebook_square from "../images/facebook-logo_square.svg";
import facebook from "../images/facebook-logo.svg";
import twitter_square from "../images/twitter-logo_square.svg";
import twitter from "../images/twitter-logo.svg";
import google from "../images/google-logo.png";
import { kebabToRegular } from "../utils";
import { useDisplaySize } from "../hooks";

interface IProps {
  formType: string;
}

const AuthProviders = ({ formType }: IProps) => {
  const tabletUp = useDisplaySize("sm");
  const laptopUp = useDisplaySize("md");

  return (
    <Box
      width="100%"
      component="section"
      id="auth-providers"
      sx={{
        "& .MuiButton-root": {
          pl: 1,
          textTransform: "capitalize",
          justifyContent: "flex-start",
          "&:not(:first-of-type)": {
            py: 0.5
          },
          "&:first-of-type": {
            pt: 0.65,
            pb: 0.3
          },

          "& .MuiButton-startIcon": {
            flexGrow: 0.5
          }
        }
      }}
    >
      <h2>{kebabToRegular(formType)} with providers</h2>
      {laptopUp && (
        <Typography align="center" color="GrayText" sx={{ my: 2 }}>
          OR
        </Typography>
      )}
      {tabletUp ? (
        <Stack spacing={2}>
          <Button
            startIcon={
              <img
                src={facebook_square}
                alt="facebook"
                width="30"
                height="30"
              />
            }
          >
            {kebabToRegular(formType)} with facebook
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<img src={google} alt="google" width="30" height="30" />}
          >
            {kebabToRegular(formType)} with google
          </Button>
          <Button
            sx={{ bgcolor: "#1DA1F2" }}
            startIcon={
              <img src={twitter_square} alt="twitter" width="30" height="30" />
            }
          >
            {kebabToRegular(formType)} with twitter
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={5} justifyContent="center">
          <IconButton>
            <img src={facebook} alt="facebook" width="40" height="40" />
          </IconButton>
          <IconButton>
            <img src={google} alt="google" width="40" height="40" />
          </IconButton>
          <IconButton>
            <img src={twitter} alt="twitter" width="40" height="40" />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default AuthProviders;
