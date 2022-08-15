/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import facebook_square from "../images/facebook-logo_square.svg";
import facebook from "../images/facebook-logo.svg";

import google from "../images/google-logo.png";
import {
  getRedirectUrlFromState,
  kebabToRegular,
  saveRefreshToken,
  TState
} from "../utils";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useDisplaySize } from "../hooks";
import { GoogleLogin } from "react-google-login";
import { API } from "../lib";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface IProps {
  formType: string;
  setMessage: (message: string) => void;
}

const AuthProviders = ({ formType, setMessage }: IProps) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  //responses
  const responseGoogle = async (response: Record<string, any>) => {
    if (response.accessToken) {
      const { profileObj } = response;
      try {
        const { data } = await API.post("/auth/oauth/google", profileObj);
        saveRefreshToken(data?.refreshToken);

        navigate(getRedirectUrlFromState(state as TState), { replace: true });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.message);
        }
      }
    }
  };

  const responseFacebook = async (response: Record<string, any>) => {
    console.log(response);
    if (response.accessToken) {
      const { profileObj } = response;
      try {
        const { data } = await API.post("/auth/oauth/facebook", profileObj);
        saveRefreshToken(data?.refreshToken);

        navigate(getRedirectUrlFromState(state as TState), { replace: true });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.message);
        }
      }
    }
  };

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
          <FacebookLogin
            appId="479876153580321"
            autoLoad
            callback={responseFacebook}
            scope="email public_profile"
            render={(renderProps: Record<string, any>) => (
              <Button
                onClick={renderProps.onClick}
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
            )}
          />

          <GoogleLogin
            clientId="250767377397-68p1knjngdur342c3qcs993994otnhar.apps.googleusercontent.com"
            render={(renderProps: Record<string, any>) => (
              <Button
                variant="outlined"
                color="error"
                onClick={renderProps.onClick}
                startIcon={
                  <img src={google} alt="google" width="30" height="30" />
                }
              >
                {kebabToRegular(formType)} with google
              </Button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
        </Stack>
      ) : (
        <Stack direction="row" spacing={5} justifyContent="center">
          <IconButton>
            <img src={facebook} alt="facebook" width="40" height="40" />
          </IconButton>
          <IconButton>
            <img src={google} alt="google" width="40" height="40" />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default AuthProviders;
