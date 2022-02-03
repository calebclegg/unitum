import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/system/Box";
import { Theme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { useData, useUser } from "../hooks";

const Feed = () => {
  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );
  const laptopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("md")
  );
  const desktopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("lg")
  );

  console.log({ tabletUp });
  const { user } = useUser();
  const { data: posts, mutate } = useData<IPost[]>("posts");

  return (
    <>
      <Paper
        square
        variant="outlined"
        sx={{
          px: 3,
          py: 1.5,
          maxWidth: ({ breakpoints }) => breakpoints.values.md
        }}
      >
        <Typography variant="h5" fontWeight={500} component="h1">
          Feed
        </Typography>
      </Paper>
      <Stack
        spacing={2}
        maxWidth={({ breakpoints }) => breakpoints.values.md}
        sx={{
          "& .MuiPaper-rounded:first-of-type": {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }
        }}
      >
        {posts?.map((post) => (
          <PostCard key={post._id} {...post} revalidate={mutate} />
        ))}
      </Stack>
      {tabletUp && (
        <Box position="relative" top={0} mr={desktopUp ? undefined : 6}>
          <Paper
            square
            id="communities"
            variant="outlined"
            component="section"
            sx={{
              mt: 11,
              position: "sticky",
              top: ({ spacing }) => spacing(11),
              width: "max-content",
              maxWidth: laptopUp ? undefined : 300
            }}
          >
            <Typography variant="h6" component="h2">
              Communities
            </Typography>
            <List>
              {user?.profile.communities.map(({ id, name, path }) => (
                <ListItem
                  key={id}
                  button
                  component={Link}
                  to={`/communities/${path}`}
                  sx={{ my: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{ sx: { whiteSpace: "nowrap" } }}
                  >
                    {name}
                  </ListItemText>
                  <Typography
                    variant="caption"
                    fontSize="0.5rem"
                    sx={{
                      ml: 4,
                      color: "grey.100",
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    {Math.floor(Math.random() * 100)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <MuiLink component={Link} to="/communities">
              See all communities
            </MuiLink>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default Feed;
