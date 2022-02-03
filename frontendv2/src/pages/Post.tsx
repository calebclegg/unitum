import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import PostDetails from "../components/PostDetails";

const Post = () => {
  const { post_id } = useParams<{ post_id: string }>();
  const laptopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("md")
  );

  return (
    <>
      {laptopUp ? (
        <Paper variant="outlined" sx={{ mb: 12, position: "relative" }}>
          <PostDetails id={post_id} />
        </Paper>
      ) : (
        <Dialog fullScreen open={Boolean(post_id)}>
          <Stack direction="row">
            <IconButton
              aria-label="go back"
              onClick={() => window.history.back()}
            >
              <ArrowBack />
            </IconButton>
          </Stack>
          <PostDetails id={post_id} />
        </Dialog>
      )}
    </>
  );
};

export default Post;
