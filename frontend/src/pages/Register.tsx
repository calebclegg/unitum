import Helmet from "react-helmet";
import axios from "axios";
import MuiLink from "@mui/material/Link";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormikHelpers } from "formik";
import { API, registerSchema, registerValues, TRegisterValues } from "../lib";
import { camelToCapitalized } from "../utils";
import { getUrl, TState } from "../utils/get-url";
import CustomInput from "../components/CustomInput";
import FormLayout from "../components/FormLayout";

const Register = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    values: Partial<TRegisterValues>,
    { setSubmitting }: FormikHelpers<Partial<TRegisterValues>>
  ) => {
    try {
      await API.post("auth/register", values);
      navigate("/login", {
        state: {
          condition: "auth-success",
          from: getUrl(),
          existing: (state as TState)?.from
        }
      });
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
        <title>Create an Account</title>
      </Helmet>
      <FormLayout
        handleSubmit={handleSubmit}
        authError={errorMessage}
        initialValues={registerValues}
        validationSchema={registerSchema}
        title="Create an account"
        formType="sign-up"
        formFooter={
          <>
            Already a member?&nbsp;
            <MuiLink component={Link} to="/login" state={state}>
              Login here
            </MuiLink>
          </>
        }
      >
        {Object.keys(registerValues).map((field) => (
          <CustomInput
            key={field}
            name={field}
            passwordType="new"
            label={camelToCapitalized(field)}
          />
        ))}
      </FormLayout>
    </>
  );
};

export default Register;
