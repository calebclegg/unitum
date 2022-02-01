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
import { API } from "../lib";
import { useUser } from "../hooks";

export interface IProps {
  _id: number;
  upvotes: number;
  media: string;
  numberOfComments: number;
  community: string;
  author: {
    profile: {
      _id: string;
      fullName: string;
    };
  };
  body: string;
  createdAt: string;
  revalidate?: () => void;
}

const Post = ({
  _id,
  author,
  upvotes,
  body,
  numberOfComments,
  community,
  createdAt,
  revalidate
}: Partial<IProps>) => {
  const { token } = useUser();
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );
  const [saved, setSaved] = useState(false);
  const [vote, setVote] = useState({ upVote: false, downVote: false });

  const toggleSaved = () => setSaved(!saved);

  const addVote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { vote }: { vote?: "upVote" | "downVote" } =
      event.currentTarget.dataset;

    if (vote) {
      if (vote === "upVote") {
        await API.patch(`posts/${_id}/upvote`, undefined, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        revalidate?.();

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
              {author?.profile.fullName}
            </span>
            <span>&bull;</span>
            <span>{createdAt}</span>
          </>
        }
        titleTypographyProps={{ fontWeight: 500, variant: "h6" }}
        subheaderTypographyProps={{ sx: { display: "flex", gap: 1 } }}
      />
      <Stack direction="row" ml={2}>
        <Stack alignItems="center">
          <IconButton
            size="small"
            color={vote.upVote ? "secondary" : "default"}
            aria-label="up vote"
            data-vote="upVote"
            onClick={addVote}
          >
            <Forward fontSize="small" transform="rotate(-90)" />
          </IconButton>
          <Typography variant="caption">{upvotes}</Typography>
          <IconButton
            size="small"
            color={vote.downVote ? "secondary" : "default"}
            aria-label="down vote"
            data-vote="downVote"
            onClick={addVote}
          >
            <Forward fontSize="small" transform="rotate(90)" />
          </IconButton>
        </Stack>
        <div>
          <CardContent sx={{ py: 0.5 }}>
            <MuiLink
              component={Link}
              to={`/feed/${_id}`}
              color="textSecondary"
              underline="none"
            >
              {body}
            </MuiLink>
          </CardContent>
          <CardActions>
            <Button
              variant="text"
              component={Link}
              to={`/feed/${_id}#comments`}
            >
              {numberOfComments ? (
                <>Comments ({numberOfComments})</>
              ) : (
                <>No comments yet</>
              )}
            </Button>
          </CardActions>
        </div>
      </Stack>
    </Card>
  );
};

export default Post;
