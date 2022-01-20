import Helmet from "react-helmet";
import axios from "axios";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import { FormikHelpers } from "formik";
import { API, registerSchema, registerValues, TRegisterValues } from "../lib";
import { camelToCapitalized } from "../utils";
import CustomInput from "../components/CustomInput";
import FormLayout from "../components/FormLayout";

const Register = () => {
  const handleSubmit = async (
    values: Partial<TRegisterValues>,
    { setSubmitting }: FormikHelpers<Partial<TRegisterValues>>
  ) => {
    try {
      await API.post("auth/register", values);
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
        <title>Create an Account</title>
      </Helmet>
      <FormLayout
        loadingIndicator="Creating your account..."
        handleSubmit={handleSubmit}
        initialValues={registerValues}
        validationSchema={registerSchema}
        title="Create an account"
        formType="sign-up"
        formFooter={
          <>
            Already a member?&nbsp;
            <MuiLink component={Link} to="/login">
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
