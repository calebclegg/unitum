import Send from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import {
  API,
  contactSchema,
  initialContactDetails,
  TContactDetails
} from "../lib";
import { useDisplaySize } from "../hooks";
import chat from "../images/chat.svg";

const ChatImage = styled("img")`
  width: 40%;
`;

const Contact = () => {
  const tabletUp = useDisplaySize("sm");

  const handleSubmit = async (
    values: TContactDetails,
    { setSubmitting }: FormikHelpers<TContactDetails>
  ) => {
    try {
      const data = await API.post("contact", values);
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
      alignItems="flex-end"
      justifyContent="space-between"
      marginTop={10}
    >
      <Stack gap={2} width={tabletUp ? "52%" : "100%"}>
        <Typography
          data-aos="fade-down-left"
          data-aos-duration="400"
          id="contact-us-heading"
          variant="h3"
          component="h2"
          fontWeight={600}
          align={tabletUp ? undefined : "center"}
        >
          Contact Us
        </Typography>
        <Typography
          data-aos="fade-down-left"
          data-aos-duration="400"
          color="secondary"
          variant="h6"
          component="p"
          align={tabletUp ? undefined : "center"}
        >
          Get In Touch
        </Typography>
        <Paper
          data-aos="fade-up-left"
          data-aos-duration="400"
          variant="outlined"
          sx={{ p: 6, mt: 3, mb: 5, borderColor: "secondary.main" }}
        >
          <Typography
            color="secondary"
            variant="h4"
            component="h3"
            fontWeight={500}
            align={tabletUp ? undefined : "center"}
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
                <Stack
                  direction={tabletUp ? "row" : "column"}
                  alignItems="center"
                  spacing={4}
                >
                  <Field
                    component={TextField}
                    name="fullName"
                    label="Full Name"
                    variant="standard"
                    placeholder="John Doe"
                    fullWidth
                    required
                  />
                  <Field
                    component={TextField}
                    name="email"
                    type="email"
                    label="Email Address"
                    variant="standard"
                    fullWidth
                    required
                  />
                </Stack>
                <Field
                  component={TextField}
                  name="message"
                  label={tabletUp ? "Type your message here" : "Message"}
                  margin="normal"
                  variant="standard"
                  rows={3}
                  required
                  multiline
                  fullWidth
                />
                <Stack
                  direction="row"
                  justifyContent={tabletUp ? "flex-end" : "center"}
                  mt={4}
                >
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
      {tabletUp && (
        <ChatImage
          src={chat}
          alt=""
          width="500"
          loading="lazy"
          data-aos="fade-up-right"
          data-aos-duration="400"
        />
      )}
    </Stack>
  );
};

export default Contact;
