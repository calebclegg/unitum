import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import discussing from "../images/Image.svg";

const About = () => {
  return (
    <Container maxWidth="md">
      <Stack
        id="about-us"
        component="section"
        minHeight="50vh"
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="center"
        aria-labelledby="about-us-heading"
      >
        <img
          src={discussing}
          alt="two people sitting and facing each other"
          width="400"
        />
        <Stack width="50%">
          <Typography
            id="about-us-heading"
            variant="h3"
            component="h2"
            fontWeight={600}
          >
            About Us
          </Typography>
          <Typography
            color="secondary"
            variant="h6"
            component="p"
            sx={{ mt: 2 }}
          >
            Get To Know Us
          </Typography>
          <Typography sx={{ mt: 4 }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            maxime earum nostrum, assumenda voluptatum veritatis, temporibus
            numquam molestiae sed vero voluptatem! Reprehenderit, dolorum! Fuga
            repellat numquam perspiciatis reprehenderit aliquam atque.
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default About;
