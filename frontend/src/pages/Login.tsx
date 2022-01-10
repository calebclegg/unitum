import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { loginValues } from "../lib";
import { camelToCapitalized } from "../utils";
import CustomInput from "../components/CustomInput";
import FormLayout from "../components/FormLayout";
import Helmet from "react-helmet";
const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login to your Account</title>
      </Helmet>
      <FormLayout
        initialValues={loginValues}
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
