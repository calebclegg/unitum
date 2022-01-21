import Bookmark from "@mui/icons-material/Bookmark";
import Forward from "@mui/icons-material/Forward";
import BookmarkOutlined from "@mui/icons-material/BookmarkBorderOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import { useState } from "react";
import { Link } from "react-router-dom";

export interface IProps {
  id?: number;
  upvotes?: number;
  comments?: number;
  community?: string;
  author?: string;
  content?: string;
  publishedDate?: string;
}

const Post = ({
  id,
  author,
  upvotes,
  content,
  comments,
  community,
  publishedDate
}: IProps) => {
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );
  const [saved, setSaved] = useState(false);
  const [vote, setVote] = useState({ upVote: false, downVote: false });

  const toggleSaved = () => setSaved(!saved);

  const addVote = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { vote }: { vote?: "upVote" | "downVote" } =
      event.currentTarget.dataset;

    if (vote) {
      setVote((prevState) =>
        vote === "upVote"
          ? { upVote: !prevState.upVote, downVote: false }
          : { upVote: false, downVote: !prevState.downVote }
      );
    }
  };

  return (
    <Card variant="outlined" sx={{ p: tabletUp ? 1 : 0 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "rgb(255, 0, 0)" }} aria-label="recipe">
            {community?.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton
            sx={{ color: ({ customPalette }) => customPalette.navyBlue }}
            aria-label={saved ? "remove post from saved" : "save post"}
            onClick={toggleSaved}
          >
            {saved ? <Bookmark /> : <BookmarkOutlined />}
          </IconButton>
        }
        title={community}
        subheader={
          <>
            <span
              style={
                tabletUp
                  ? undefined
                  : {
                      width: 80,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }
              }
            >
              {author}
            </span>
            <span>&bull;</span>
            <span>{publishedDate}</span>
          </>
        }
        titleTypographyProps={{ fontWeight: 500, variant: "h6" }}
        subheaderTypographyProps={{ sx: { display: "flex", gap: 1 } }}
      />
      <Stack direction="row" ml={2}>
        <Stack alignItems="center" spacing={1}>
          <IconButton
            color={vote.upVote ? "secondary" : "default"}
            aria-label="up vote"
            data-vote="upVote"
            onClick={addVote}
          >
            <Forward transform="rotate(-90)" />
          </IconButton>
          <Typography variant="body1">{upvotes}</Typography>
          <IconButton
            color={vote.downVote ? "secondary" : "default"}
            aria-label="down vote"
            data-vote="downVote"
            onClick={addVote}
          >
            <Forward transform="rotate(90)" />
          </IconButton>
        </Stack>
        <div>
          <CardContent sx={{ pt: 0.5 }}>
            <MuiLink
              component={Link}
              to={`/feed/${id}`}
              color="textSecondary"
              underline="none"
            >
              {content}
            </MuiLink>
          </CardContent>
          <CardActions>
            <Button variant="text" component={Link} to={`/feed/${id}#comments`}>
              {comments ? <>Comments ({comments})</> : <>No comments yet</>}
            </Button>
          </CardActions>
        </div>
      </Stack>
    </Card>
  );
};

export default Post;
