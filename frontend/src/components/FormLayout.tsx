import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { visuallyHidden } from "@mui/utils";
import { Form, Formik, FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import {
  TLoginSchema,
  TLoginValues,
  TRegisterSchema,
  TRegisterValues
} from "../lib";
import { kebabToCapitalized } from "../utils";
import { useDisplaySize } from "../hooks";
import AuthProviders from "./AuthProviders";

interface IProps {
  children: React.ReactNode;
  formType: "sign-up" | "sign-in";
  formFooter: React.ReactNode;
  handleSubmit: (
    values: Partial<TRegisterValues>,
    actions: FormikHelpers<Partial<TRegisterValues>>
  ) => void;
  loadingIndicator: string;
  initialValues: TLoginValues | TRegisterValues;
  validationSchema: TLoginSchema | TRegisterSchema;
  title: string;
}

const FormLayout = ({
  title,
  children,
  formType,
  formFooter,
  handleSubmit,
  initialValues,
  validationSchema,
  loadingIndicator
}: IProps) => {
  const laptopUp = useDisplaySize("md");

  return (
    <Box
      py={2}
      bgcolor={laptopUp ? undefined : "#fff"}
      minHeight="100vh"
      display="flex"
      alignItems={laptopUp ? "center" : undefined}
      justifyContent="center"
    >
      <Container maxWidth="md">
        <nav>
          <Button
            variant="text"
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={({ breakpoints }) => ({
              mb: 2,

              [breakpoints.up("md")]: {
                transform: "translateY(-30px)"
              }
            })}
          >
            Go back home
          </Button>
        </nav>
        <Paper
          component="main"
          sx={{
            py: laptopUp ? 6 : undefined,
            px: laptopUp ? 8 : undefined,
            "& h2": visuallyHidden
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            fontWeight={500}
            sx={{ mb: laptopUp ? 4 : 3 }}
          >
            {title}
          </Typography>
          <Stack
            direction={laptopUp ? "row" : "column"}
            justifyContent="center"
          >
            <section id="auth-form">
              <h2>{kebabToCapitalized(formType)} with email</h2>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form id={`${formType}-form`} name={formType}>
                    {children}
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isSubmitting}
                      loadingIndicator={loadingIndicator}
                      fullWidth
                      sx={{ my: 2 }}
                    >
                      {kebabToCapitalized(formType)}
                    </LoadingButton>
                  </Form>
                )}
              </Formik>
              <Typography>{formFooter}</Typography>
            </section>
            {laptopUp ? (
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
