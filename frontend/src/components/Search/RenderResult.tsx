import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import { ICommunity, IUser } from "../../hooks";
import { IProps as IPost } from "../../components/PostCard";
import { Link } from "react-router-dom";
import Tag from "../Tag";
interface IProps {
  result: unknown;
  query: string;
}

const User = ({ result, query }: { result: IUser; query: string }) => {
  return (
    <ListItem component={Link} to={`/users/${result._id}`}>
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          src={result.profile.picture}
          alt={result.profile.fullName + "'s avatar"}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            dangerouslySetInnerHTML={{
              __html: highlight(result.profile.fullName, query)
            }}
          />
        }
        secondary={<Tag type="user" />}
      />
    </ListItem>
  );
};

const Community = ({
  result,
  query
}: {
  result: ICommunity;
  query: string;
}) => {
  return (
    <ListItem component={Link} to={`/communities/${result._id}`}>
      <ListItemAvatar>
        <Avatar variant="rounded" src={result.picture} alt={result.name}>
          D
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            dangerouslySetInnerHTML={{ __html: highlight(result.name, query) }}
          />
        }
        secondary={
          <>
            <Typography
              variant="caption"
              dangerouslySetInnerHTML={{
                __html: highlight(result.description, query)
              }}
            />
            <Tag type="community" />
          </>
        }
      />
    </ListItem>
  );
};

export const highlight = (text: string, query: string) => {
  const bodyIndex = text.indexOf(query);
  const start = bodyIndex - 50 >= 0 ? bodyIndex - 5 : 0;
  const end = bodyIndex + 50;

  const body = text.slice(start, end);
  const regex = new RegExp(query, "ig");
  const highlighted = body.replaceAll(regex, `<mark>${query}</mark>`);

  return highlighted;
};

const Post = ({ result, query }: { result: IPost; query: string }) => {
  return (
    <ListItem component={Link} to={`/posts/${result._id}`}>
      <ListItemAvatar>
        <Avatar variant="rounded" src={result.author.profile.picture}></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            dangerouslySetInnerHTML={{ __html: highlight(result.body, query) }}
          />
        }
        secondary={<Tag type="post" />}
      />
    </ListItem>
  );
};
const RenderResult = ({ result, query }: IProps) => {
  const resultType = {
    user: <User result={result as IUser} query={query} />,
    post: <Post result={result as IPost} query={query} />,
    community: <Community result={result as ICommunity} query={query} />
  };

  const type = (result as Record<string, any>).type as
    | "user"
    | "post"
    | "community";

  return <div>{resultType[type]}</div>;
};

export default RenderResult;
