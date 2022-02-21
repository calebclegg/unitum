import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useDisplaySize } from "../hooks";
import discussing from "../images/Image.png";

const Image = styled("img")(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: "50%"
  }
}));

const About = () => {
  const tabletUp = useDisplaySize("sm");

  return (
    <Container maxWidth="md">
      <Stack
        id="about-us"
        component="section"
        direction={tabletUp ? "row" : "column"}
        spacing={3}
        alignItems="center"
        justifyContent="center"
        aria-labelledby="about-us-heading"
      >
        <Image
          src={discussing}
          alt="two people sitting and facing each other"
          width="400"
          data-aos="fade-up-right"
          data-aos-duration="400"
        />
        <Stack width={tabletUp ? "50%" : "100%"}>
          <Typography
            data-aos="fade-down-left"
            data-aos-duration="400"
            id="about-us-heading"
            variant="h3"
            component="h2"
            fontWeight={600}
            align={tabletUp ? undefined : "center"}
          >
            About Us
          </Typography>
          <Typography
            data-aos="fade-down-left"
            data-aos-duration="400"
            color="secondary"
            variant="h6"
            component="p"
            sx={{ mt: 2 }}
            align={tabletUp ? undefined : "center"}
          >
            Get To Know Us
          </Typography>
          <Typography
            sx={{ mt: 4 }}
            align={tabletUp ? undefined : "center"}
            data-aos="fade-down-right"
            data-aos-duration="400"
          >
            Unitum exists for students to learn, earn, collaborate and
            socialise. It’s a platform that aims to streamline student life by
            making all student necessities accessible, at the click of a button.
            The main objective of unitum is to remove the barriers that separate
            different universities and their student body’s and create a student
            environment where there is commonality. Doing this will allow
            students to interact academically and socially. Currently the
            platform is open to all tertiary education/ third level students.
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default About;
