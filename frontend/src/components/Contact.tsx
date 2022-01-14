import Send from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import chat from "../images/chat.svg";
import {
  API,
  contactSchema,
  initialContactDetails,
  TContactDetails
} from "../lib";

const Contact = () => {
  const handleSubmit = async (
    values: TContactDetails,
    { setSubmitting }: FormikHelpers<TContactDetails>
  ) => {
    try {
      const data = await API.post("contact", values);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack
      id="contact-us"
      component="section"
      aria-labelledby="contact-us-heading"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Stack spacing={3}>
        <Typography
          id="contact-us-heading"
          variant="h3"
          component="h2"
          fontWeight={600}
        >
          Contact Us
        </Typography>
        <Typography color="secondary" variant="h6" component="p">
          Get In Touch
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 8, mt: 3, borderColor: "secondary.main" }}
        >
          <Typography
            color="secondary"
            variant="h4"
            component="h3"
            sx={{ mb: 2 }}
          >
            Enter your details
          </Typography>
          <Formik
            initialValues={initialContactDetails}
            validationSchema={contactSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack direction="row" mb={4} spacing={4}>
                  <Field
                    component={TextField}
                    name="firstName"
                    type="firstName"
                    label="First Name"
                    variant="standard"
                    required
                  />
                  <Field
                    component={TextField}
                    name="lastName"
                    type="lastName"
                    label="Last Name"
                    variant="standard"
                    required
                  />
                </Stack>
                <Stack direction="row" mb={4} spacing={4}>
                  <Field
                    component={TextField}
                    name="phone"
                    type="phone"
                    label="Phone"
                    variant="standard"
                  />
                  <Field
                    component={TextField}
                    name="email"
                    type="email"
                    label="Email Address"
                    variant="standard"
                    required
                  />
                </Stack>
                <Field
                  component={TextField}
                  name="message"
                  type="message"
                  label="Type your message here"
                  variant="standard"
                  required
                  fullWidth
                />
                <Stack direction="row" justifyContent="flex-end" mt={3}>
                  <LoadingButton
                    type="submit"
                    color="secondary"
                    variant="contained"
                    loading={isSubmitting}
                    endIcon={<Send />}
                    loadingIndicator="sending..."
                  >
                    Send message
                  </LoadingButton>
                </Stack>
              </Form>
            )}
          </Formik>
        </Paper>
      </Stack>
      <img src={chat} alt="" width="400" loading="lazy" />
    </Stack>
  );
};

export default Contact;
