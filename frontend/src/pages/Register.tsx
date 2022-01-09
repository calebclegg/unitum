import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { registerValues } from "../lib";
import { camelToCapitalized } from "../utils";
import CustomInput from "../components/CustomInput";
import FormLayout from "../components/FormLayout";

const Register = () => {
  return (
    <FormLayout
      initialValues={registerValues}
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
  );
};

export default Register;
