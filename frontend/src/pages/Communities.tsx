import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { useData, useUser, usePostsActions } from "../hooks";

const Communities = () => {
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );

  const { user } = useUser();
  const { data: posts, mutate } = useData<IPost[]>("community/posts");
  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

  return (
    <>
      {tabletUp ? (
        <>
          <Paper
            square
            variant="outlined"
            sx={{
              px: 3,
              py: 1.5,
              width: "100%"
            }}
          >
            <Typography variant="h5" fontWeight={500} component="h1">
              Communities Activities
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
            {posts?.map((post) => (
              <PostCard
                {...post}
                key={post._id}
                toggleSave={toggleSave}
                toggleVote={toggleVote}
              />
            ))}
          </Stack>
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
    </>
  );
};

export default Communities;
