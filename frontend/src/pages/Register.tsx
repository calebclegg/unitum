import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { registerValues } from "../lib";
import { generateFieldLabel } from "../utils";
import CustomInput from "../components/CustomInput";

const Register = () => {
  return (
    <Box py={2} bgcolor="#fff" minHeight="100vh">
      <Container maxWidth="md">
        <nav>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ mb: 2 }}
          >
            Go back home
          </Button>
        </nav>
        <Paper component="main">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            fontWeight={500}
            sx={{ mb: 2 }}
          >
            Create an account
          </Typography>
          <Formik initialValues={registerValues} onSubmit={console.log}>
            <Form id="sign-up-form" name="sign-up">
              {Object.keys(registerValues).map((field) => (
                <CustomInput
                  key={field}
                  name={field}
                  passwordType="new"
                  label={generateFieldLabel(field)}
                />
              ))}
              <Button variant="contained" fullWidth sx={{ my: 2 }}>
                Sign up
              </Button>
            </Form>
          </Formik>
          <Typography>
            Already a member?&nbsp;
            <MuiLink component={Link} to="/login">
              Login here
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
