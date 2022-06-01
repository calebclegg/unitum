import Pin from "@mui/icons-material/PushPin";
import ThumbUp from "@mui/icons-material/ThumbUpOutlined";
import PinOutlined from "@mui/icons-material/PushPinOutlined";
import Avatar from "@mui/material/Avatar";
import Calendar from "@mui/icons-material/CalendarTodayOutlined";
import Comment from "@mui/icons-material/ChatBubbleOutlineOutlined";
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
import { truncatePostBody } from "../utils/tunc-text";
import { CardMedia } from "@mui/material";
import Age from "./Age";
import { orange } from "@mui/material/colors";

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
    _id: string;
    profile: {
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
  media,
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
    <Card sx={{ p: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            src={author?.profile.picture}
            alt={author?.profile.fullName}
            sx={{ bgcolor: "rgb(255, 0, 0)" }}
          />
        }
        action={
          <Stack
            direction="row"
            alignItems="center"
            sx={{ color: orange[500] }}
          >
            <Calendar fontSize="small" />
            &nbsp;
            <Typography variant="caption" sx={{ color: orange[500] }}>
              {createdAt && <Age date={createdAt} />}
            </Typography>
          </Stack>
        }
        title={
          <MuiLink
            component={Link}
            to={`/communities/${communityID?._id}`}
            color="textPrimary"
            underline="none"
            fontSize={18}
          >
            {author?.profile.fullName}
          </MuiLink>
        }
        subheader={
          <>
            {communityID?.name && (
              <>
                <MuiLink
                  component={Link}
                  to={`/communities/${communityID._id}`}
                  color="textSecondary"
                  underline="none"
                  fontSize={13}
                >
                  {communityID.name}
                </MuiLink>
                <span>&bull;</span>
              </>
            )}
          </>
        }
        titleTypographyProps={{ fontWeight: 500, variant: "h6" }}
        subheaderTypographyProps={{ sx: { display: "flex", gap: 1 } }}
      />
      <Stack direction="row" ml={2}>
        <div style={{ width: "100%" }}>
          <MuiLink
            component={Link}
            to={`/posts/${_id}`}
            color="textPrimary"
            underline="none"
          >
            <CardContent sx={{ py: 0.5 }}>{truncatePostBody(body)}</CardContent>
            {media && media?.length > 0 && (
              <CardMedia
                component="img"
                height="500"
                sx={{
                  width: "100%"
                }}
                image={media[0]}
                alt="Paella dish"
              />
            )}
          </MuiLink>
          <CardActions>
            <Stack direction="row" alignItems="center">
              <IconButton
                size="small"
                color={upvoted ? "secondary" : "default"}
                aria-label="up vote"
                data-action="upvote"
                onClick={addVote}
              >
                <ThumbUp fontSize="small" />
              </IconButton>
              <Typography variant="caption">{upvotes}</Typography>
              <IconButton component={Link} to={`/posts/${_id}#comments`}>
                <Comment fontSize="small" />
              </IconButton>
              <Typography variant="caption">
                {" "}
                {numberOfComments ? <>{numberOfComments}</> : <>0</>}
              </Typography>
              <IconButton
                sx={{ color: ({ customPalette }) => customPalette.navyBlue }}
                aria-label={saved ? "remove post from saved" : "save post"}
                onClick={() => _id && toggleSave(_id)}
              >
                {saved ? (
                  <Pin fontSize="small" transform="rotate(45)" />
                ) : (
                  <PinOutlined fontSize="small" transform="rotate(45)" />
                )}
              </IconButton>
            </Stack>
          </CardActions>
        </div>
      </Stack>
    </Card>
  );
};

export default PostCard;
