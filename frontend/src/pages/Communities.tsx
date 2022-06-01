import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import { useData, useUser, usePostsActions } from "../hooks";
// import PostCard, { IProps as IPost } from "../components/PostCard";
import CommunityPostCard, {
  IProps as IPost
} from "../components/CommunityPostCard";

import FeedLayout from "../components/FeedLayout";
import { lazy, Suspense } from "react";

const CreateCommunity = lazy(() => import("../components/CreateCommunity"));

const Communities = () => {
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );

  const { user } = useUser();
  const { data: posts, mutate } = useData<IPost[]>("community/posts");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

  return (
    <>
      {tabletUp ? (
        <>
          <FeedLayout title="Recent Activities">
            {posts?.map((post) => (
              <CommunityPostCard
                {...post}
                key={post._id}
                toggleSave={toggleSave}
                toggleVote={toggleVote}
              />
            ))}
          </FeedLayout>
        </>
      ) : (
        <>
          <Typography variant="h5" component="h1" sx={{ my: 1 }}>
            Communities Lists
          </Typography>
          <List>
            {user?.profile.communities.map(
              ({ _id, name, picture }, index, array) => (
                <ListItem
                  key={_id}
                  button
                  component={Link}
                  to={`/communities/${_id}`}
                  sx={{ my: 2 }}
                  divider={index !== array.length - 1}
                >
                  <ListItemAvatar>
                    <Avatar src={picture} alt={name} variant="rounded" />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{ sx: { whiteSpace: "nowrap" } }}
                  >
                    {name}
                  </ListItemText>
                </ListItem>
              )
            )}
          </List>
        </>
      )}
      <Suspense fallback={<div />}>
        <CreateCommunity />
      </Suspense>
    </>
  );
};

export default Communities;
