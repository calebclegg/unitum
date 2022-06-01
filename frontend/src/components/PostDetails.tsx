import Send from "@mui/icons-material/Send";
import Forward from "@mui/icons-material/Forward";
import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, styled, Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth";
import { useData, useUser } from "../hooks";
import { API } from "../lib";
import Edit from "@mui/icons-material/Edit";
import ImageListDisplay from "./ImageList";
import Age from "./Age";

const Form = styled("form")(({ theme }) => ({
  width: "98%",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.1),

  [theme.breakpoints.up("sm")]: {
    alignItems: "flex-end",
    flexDirection: "column",
    gap: theme.spacing(2)
  }
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

interface IProps {
  id?: string;
}

const PostDetails = ({ id }: IProps) => {
  const { token } = useAuth();
  const laptopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("md")
  );
  const [vote, setVote] = useState({ upVote: false, downVote: false });
  const [postingComment, setPostingComment] = useState(false);
  const { data: post, mutate: revalidatePosts } = useData<Record<string, any>>(
    `posts/${id}`,
    { refreshInterval: 5000 }
  );
  const { data: comments, mutate: revalidateComments } = useData<IComment[]>(
    `posts/${id}/comments`,
    { refreshInterval: 1000 }
  );

  const sortedComments = laptopUp ? [...(comments || [])].reverse() : comments;

  const { user } = useUser();

  useEffect(() => {
    if (post) {
      setVote({ upVote: post.upvoted, downVote: post.downvoted });
    }
  }, [post]);

  const addVote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { vote }: { vote?: "upVote" | "downVote" } =
      event.currentTarget.dataset;

    if (vote) {
      if (vote === "upVote") {
        await API.patch(`posts/${id}/upvote`, undefined, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setVote((prevState) => ({
          upVote: !prevState.upVote,
          downVote: false
        }));
      } else {
        await API.patch(`posts/${id}/downvote`, undefined, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setVote((prevState) => ({
          upVote: false,
          downVote: !prevState.downVote
        }));
      }

      revalidatePosts?.();
    }
  };

  const postComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setPostingComment(true);
      await API.post(
        `posts/${id}/comments`,
        {
          text: formData.get("comment")
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
    <>
      <Card sx={{ p: 0, mb: 2, overflow: "initial" }}>
        <CardHeader
          avatar={
            <Avatar
              src={post?.author.profile.picture}
              alt={post?.author.profile.fullName}
            />
          }
          action={
            post?.author._id === user?._id && (
              <IconButton aria-label="settings">
                <Edit fontSize="small" />
              </IconButton>
            )
          }
          title={post?.author.profile.fullName}
          subheader={post && <span>{<Age date={post.createdAt} />}</span>}
        />
        <CardContent>
          <Typography>{post?.body}</Typography>
          <ImageListDisplay media={post?.media} />
        </CardContent>
        <CardActions>
          <Stack direction="row" alignItems="center" spacing={1}>
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
      {laptopUp && (
        <Stack
          my={2}
          width="100%"
          bgcolor="#fff"
          direction="row"
          justifyContent="center"
        >
          <Form id="comment-form" onSubmit={postComment}>
            <FormControl sx={{ width: "inherit" }}>
              <OutlinedInput
                fullWidth
                multiline
                rows={3}
                size="small"
                name="comment"
                id="comment-input"
                autoComplete="off"
                inputComponent="textarea"
                disabled={postingComment}
                inputProps={{
                  placeholder: "Enter your comment here",
                  "aria-label": "Comment"
                }}
                sx={{ bgcolor: ({ palette }) => alpha(palette.grey[600], 0.1) }}
              />
            </FormControl>

            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              loading={postingComment}
              disabled={postingComment}
            >
              Comment
            </LoadingButton>
          </Form>
        </Stack>
      )}
      <List sx={{ pb: 8 }}>
        {sortedComments?.map((comment) => (
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
                {<span>{<Age date={comment.createdAt} />}</span>}
              </Typography>
            </Stack>
          </ListItem>
        ))}
      </List>
      {!laptopUp && (
        <Stack
          p={1.5}
          width="100%"
          borderTop={({ palette }) => `2px solid ${palette.divider}`}
          bgcolor="#fff"
          direction="row"
          position="fixed"
          justifyContent="center"
          left="50%"
          bottom={0}
          sx={{ transform: "translateX(-50%)" }}
        >
          <Form id="comment-form" onSubmit={postComment}>
            <FormControl sx={{ width: "inherit" }}>
              <OutlinedInput
                fullWidth
                size="small"
                name="comment"
                id="comment-input"
                autoComplete="off"
                disabled={postingComment}
                inputProps={{
                  placeholder: "Enter your comment here",
                  "aria-label": "Comment"
                }}
                sx={{ bgcolor: ({ palette }) => alpha(palette.grey[600], 0.1) }}
              />
            </FormControl>
            <IconButton type="submit" color="primary" disabled={postingComment}>
              {postingComment ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
          </Form>
        </Stack>
      )}
    </>
  );
};

export default PostDetails;
