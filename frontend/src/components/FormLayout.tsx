import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Box } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { kebabToCapitalized } from "../utils";
import AuthProviders from "./AuthProviders";

interface IProps {
  children: React.ReactNode;
  formType: "sign-up" | "sign-in";
  formFooter: React.ReactNode;
  initialValues: Record<string, string>;
  title: string;
}

const FormLayout = ({
  children,
  formType,
  formFooter,
  initialValues,
  title
}: IProps) => {
  const { breakpoints } = useTheme();
  const laptop = useMediaQuery(breakpoints.up("md"));

  return (
    <Box
      py={2}
      bgcolor={laptop ? undefined : "#fff"}
      minHeight="100vh"
      display="flex"
      alignItems={laptop ? "center" : undefined}
      justifyContent="center"
    >
      <Container maxWidth="md">
        <nav>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{
              mb: 2,
              [breakpoints.up("md")]: {
                transform: "translateY(-30px)"
              }
            }}
          >
            Go back home
          </Button>
        </nav>
        <Paper
          component="main"
          sx={{
            py: laptop ? 6 : undefined,
            px: laptop ? 8 : undefined,
            "& h2": visuallyHidden
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            fontWeight={500}
            sx={{ mb: laptop ? 4 : 3 }}
          >
            {title}
          </Typography>
          <Stack direction={laptop ? "row" : "column"} justifyContent="center">
            <section id="auth-form">
              <h2>{kebabToCapitalized(formType)} with email</h2>
              <Formik initialValues={initialValues} onSubmit={console.log}>
                <Form id={`${formType}-form`} name={formType}>
                  {children}
                  <Button variant="contained" fullWidth sx={{ my: 2 }}>
                    {kebabToCapitalized(formType)}
                  </Button>
                </Form>
              </Formik>
              <Typography>{formFooter}</Typography>
            </section>
            {laptop ? (
              <Divider
                sx={{ mx: 5, height: "inherit" }}
                orientation="vertical"
              />
            ) : (
              <Divider sx={{ mt: 4, mb: 3 }}>
                Or {kebabToCapitalized(formType)} with
              </Divider>
            )}
            <AuthProviders formType={formType} />
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default FormLayout;