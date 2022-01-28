import Helmet from "react-helmet";
import axios from "axios";
import MuiLink from "@mui/material/Link";
import { Link, useNavigate } from "react-router-dom";
import { FormikHelpers } from "formik";
import { API, loginSchema, loginValues, TLoginValues } from "../lib";
import { camelToCapitalized } from "../utils";
import CustomInput from "../components/CustomInput";
import FormLayout from "../components/FormLayout";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: Partial<TLoginValues>,
    { setSubmitting }: FormikHelpers<Partial<TLoginValues>>
  ) => {
    try {
      const { data } = await API.post("auth/login", values);
      localStorage.setItem("token", data.refreshToken);
      navigate("/feed", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
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
        loadingIndicator="Fetching your account..."
        initialValues={loginValues}
        validationSchema={loginSchema}
        handleSubmit={handleSubmit}
        title="Welcome back"
        formType="sign-in"
        formFooter={
          <>
            Don&apos;t have an account?&nbsp;
            <MuiLink component={Link} to="/register">
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
