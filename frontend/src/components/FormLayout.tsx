import { ArrowBack } from "@mui/icons-material";
import { Button, Container, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { kebabToCapitalized } from "../utils";

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
            {title}
          </Typography>
          <Formik initialValues={initialValues} onSubmit={console.log}>
            <Form id={`${formType}-form`} name={formType}>
              {children}
              <Button variant="contained" fullWidth sx={{ my: 2 }}>
                {kebabToCapitalized(formType)}
              </Button>
            </Form>
          </Formik>
          <Typography>{formFooter}</Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default FormLayout;
