import Send from "@mui/icons-material/Send";
import Forward from "@mui/icons-material/Forward";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import useSWR from "swr";
import { alpha, styled } from "@mui/material/styles";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../hooks";
import { fetcher } from "../utils";
import { API } from "../lib";

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.1)
}));

interface IComment {
  _id: string;
  postID: string;
  text: string;
  createdAt: string;
  author: {
    _id: string;
    profile: {
      picture: string;
      fullName: string;
    };
  };
}

const Post = () => {
  const { token } = useUser();
  const { post_id } = useParams<{ post_id: string }>();
  const [vote, setVote] = useState({ upVote: false, downVote: false });
  const [postingComment, setPostingComment] = useState(false);
  const { data: post, mutate: revalidatePosts } = useSWR(
    token ? [`posts/${post_id}`, token] : null,
    fetcher
  );
  const { data: comments, mutate: revalidateComments } = useSWR<IComment[]>(
    token ? [`posts/${post_id}/comments`, token] : null,
    fetcher
  );

  const addVote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { vote }: { vote?: "upVote" | "downVote" } =
      event.currentTarget.dataset;

    if (vote) {
      if (vote === "upVote") {
        await API.patch(`posts/${post_id}/upvote`, undefined, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        revalidatePosts?.();

        setVote((prevState) => ({
          upVote: !prevState.upVote,
          downVote: false
        }));
      } else {
        setVote((prevState) => ({
          upVote: false,
          downVote: !prevState.downVote
        }));
      }
    }
  };

  console.log({ comments });

  const postComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setPostingComment(true);
      await API.post(
        `posts/${post_id}/comments`,
        {
          text: formData.get("comment")
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      revalidateComments?.();
      (event.target as typeof event.currentTarget).reset();
    } catch (error) {
      console.log(error);
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <Dialog fullScreen open={Boolean(post_id)}>
      <Card sx={{ p: 0, mb: 8 }}>
        <CardHeader
          avatar={<Avatar aria-label="recipe">R</Avatar>}
          title={post?.author.profile.fullName}
          subheader={post && new Date(post.createdAt).toDateString()}
        />
        <CardContent>
          <Typography>{post?.body}</Typography>
        </CardContent>
        <CardActions>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              color={vote.upVote ? "secondary" : "default"}
              aria-label="up vote"
              data-vote="upVote"
              onClick={addVote}
            >
              <Forward transform="rotate(-90)" />
            </IconButton>
            <Typography>{post?.upvotes}</Typography>
            <IconButton
              color={vote.downVote ? "secondary" : "default"}
              aria-label="down vote"
              data-vote="downVote"
              onClick={addVote}
            >
              <Forward transform="rotate(90)" />
            </IconButton>
          </Stack>
        </CardActions>
      </Card>
      <Typography variant="h6" component="h2">
        Comments
      </Typography>
      <List>
        {comments?.map((comment) => (
          <ListItem key={comment._id} sx={{ flexDirection: "column" }}>
            <Stack width="100%" direction="row">
              <ListItemAvatar sx={{ mt: 1 }}>
                <Avatar
                  src={comment.author.profile.picture}
                  alt={comment.author.profile.fullName}
                />
              </ListItemAvatar>
              <ListItemText
                primary={comment.author.profile.fullName}
                secondary={comment.text}
              />
            </Stack>
            <Stack
              width="100%"
              color="text.secondary"
              direction="row"
              justifyContent="flex-end"
            >
              <Typography variant="caption">
                {new Date(comment.createdAt).toDateString()}
              </Typography>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Stack
        width="96%"
        direction="row"
        position="absolute"
        justifyContent="center"
        left="50%"
        bottom={10}
        sx={{ transform: "translateX(-50%)" }}
      >
        <Form id="comment-form" onSubmit={postComment}>
          <FormControl sx={{ width: "inherit" }}>
            <OutlinedInput
              fullWidth
              size="small"
              name="comment"
              id="comment-input"
              disabled={postingComment}
              sx={{ bgcolor: ({ palette }) => alpha(palette.grey[600], 0.1) }}
            />
          </FormControl>
          <IconButton type="submit" color="primary" disabled={postingComment}>
            {postingComment ? <CircularProgress size={24} /> : <Send />}
          </IconButton>
        </Form>
      </Stack>
    </Dialog>
  );
};

export default Post;
