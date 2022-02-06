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
import { Link } from "react-router-dom";

export interface IProps {
  _id: string;
  upvotes: number;
  upvoted: boolean;
  downvoted: boolean;
  saved: boolean;
  media: string[];
  numberOfComments: number;
  communityID: {
    _id: string;
    name: string;
  };
  author: {
    profile: {
      _id: string;
      picture: string;
      fullName: string;
    };
  };
  body: string;
  createdAt: string;
}

const PostCard = ({
  _id,
  author,
  upvoted,
  downvoted,
  saved,
  upvotes,
  body,
  numberOfComments,
  communityID,
  createdAt,
  toggleSave,
  toggleVote
}: Partial<IProps> & {
  toggleSave: (postID: string) => Promise<void>;
  toggleVote: (postID: string, action: "upvote" | "downvote") => Promise<void>;
}) => {
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );

  const addVote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { action }: { action?: "upvote" | "downvote" } =
      event.currentTarget.dataset;

    if (_id && action) toggleVote(_id, action);
  };

  return (
    <Card variant="outlined" sx={{ p: tabletUp ? 1 : 0 }}>
      <CardHeader
        avatar={
          <Avatar
            src={author?.profile.picture}
            alt={author?.profile.fullName}
            sx={{ bgcolor: "rgb(255, 0, 0)" }}
          />
        }
        action={
          <IconButton
            sx={{ color: ({ customPalette }) => customPalette.navyBlue }}
            aria-label={saved ? "remove post from saved" : "save post"}
            onClick={() => _id && toggleSave(_id)}
          >
            {saved ? <Bookmark /> : <BookmarkOutlined />}
          </IconButton>
        }
        title={author?.profile.fullName}
        subheader={
          <>
            {communityID?.name && (
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
                  {communityID.name}
                </span>
                <span>&bull;</span>
              </>
            )}
            <span>{createdAt && new Date(createdAt).toDateString()}</span>
          </>
        }
        titleTypographyProps={{ fontWeight: 500, variant: "h6" }}
        subheaderTypographyProps={{ sx: { display: "flex", gap: 1 } }}
      />
      <Stack direction="row" ml={2}>
        <Stack alignItems="center">
          <IconButton
            size="small"
            color={upvoted ? "secondary" : "default"}
            aria-label="up vote"
            data-action="upvote"
            onClick={addVote}
          >
            <Forward fontSize="small" transform="rotate(-90)" />
          </IconButton>
          <Typography variant="caption">{upvotes}</Typography>
          <IconButton
            size="small"
            color={downvoted ? "secondary" : "default"}
            aria-label="down vote"
            data-action="downvote"
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

export default PostCard;
