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
        minHeight="50vh"
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
        />
        <Stack width={tabletUp ? "50%" : "100%"}>
          <Typography
            id="about-us-heading"
            variant="h3"
            component="h2"
            fontWeight={600}
            align={tabletUp ? undefined : "center"}
          >
            About Us
          </Typography>
          <Typography
            color="secondary"
            variant="h6"
            component="p"
            sx={{ mt: 2 }}
            align={tabletUp ? undefined : "center"}
          >
            Get To Know Us
          </Typography>
          <Typography sx={{ mt: 4 }} align={tabletUp ? undefined : "center"}>
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
