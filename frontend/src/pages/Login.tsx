import Helmet from "react-helmet";
import axios from "axios";
import MuiLink from "@mui/material/Link";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API, loginSchema, loginValues, TLoginValues } from "../lib";
import { camelToCapitalized } from "../utils";
import { saveRefreshToken } from "../utils/store-token";
import CustomInput from "../components/CustomInput";
import FormLayout from "../components/FormLayout";
import { getRedirectUrlFromState, TState } from "../utils/get-url";

const Login = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (
    values: Partial<TLoginValues>,
    { setSubmitting }: FormikHelpers<Partial<TLoginValues>>
  ) => {
    try {
      const { data } = await API.post("auth/login", values);
      saveRefreshToken(data?.refreshToken);
      navigate(getRedirectUrlFromState(state as TState), { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login to your Account</title>
      </Helmet>
      <FormLayout
        authError={errorMessage}
        initialValues={loginValues}
        validationSchema={loginSchema}
        handleSubmit={handleSubmit}
        title="Welcome back"
        formType="sign-in"
        formFooter={
          <>
            Don&apos;t have an account?&nbsp;
            <MuiLink component={Link} to="/register" state={state}>
              Register here
            </MuiLink>
          </>
        }
      >
        {Object.keys(loginValues).map((field) => (
          <CustomInput
            key={field}
            name={field}
            passwordType="current"
            label={camelToCapitalized(field)}
          />
        ))}
      </FormLayout>
    </>
  );
};

export default Login;
