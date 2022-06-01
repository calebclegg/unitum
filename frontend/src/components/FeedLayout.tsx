import { Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CreatePost from "./CreatePostCard";

interface IProps {
  title: string;
  children: React.ReactNode;
}

const FeedLayout = ({ title, children }: IProps) => {
  return (
    <Container>
      <Paper
        sx={{
          px: 3,
          py: 1.5,
          mb: 2,
          width: "100%"
        }}
      >
        <Typography variant="h5" fontWeight={500} component="h1">
          {title}
        </Typography>
      </Paper>
      <Stack
        spacing={2}
        width="100%"
        sx={{
          "& .MuiPaper-rounded:first-of-type": {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }
        }}
      >
        <CreatePost />
        {children}
      </Stack>
    </Container>
  );
};

export default FeedLayout;
