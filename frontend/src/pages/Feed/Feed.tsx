import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BottomNav from "../../components/BottomNav";
import Box from "@mui/system/Box";
import TopBar from "../../components/TopBar";
import PostCard, { IProps } from "../../components/PostCard";
import { useDisplaySize } from "../../hooks";
import { fetcher } from "../../utils";
import { communities } from "./communities";

const Sidebar = lazy(() => import("../../components/Sidebar"));

interface IPost {
  id: number;
  title: string;
  body: string;
}

interface IUser {
  id: number;
  name: string;
  company: {
    name: string;
  };
}

interface IUserPost extends IProps {
  id?: number;
}

const Feed = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const tabletUp = useDisplaySize("sm");
  const laptopUp = useDisplaySize("md");
  const desktopUp = useDisplaySize("lg");
  const { data: posts } = useSWR<IPost[]>("posts", fetcher);
  const { data: users } = useSWR<IUser[]>("users", fetcher);
  const [userPosts, setUserPosts] = useState<IUserPost[] | null>(null);

  useEffect(() => {
    const reshapedPosts = posts
      ?.slice(0, users?.length || 0)
      .map(({ id, body }, index) => {
        const newPost: IUserPost = {
          id: id as number,
          content: body as string
        };

        newPost.author = users?.[index].name;
        newPost.community = users?.[index].company.name;
        newPost.comments = Math.round(Math.random() * 20);
        newPost.upvotes = Math.round(Math.random() * 100);
        newPost.publishedDate = new Date().toDateString();

        return newPost;
      });

    reshapedPosts && setUserPosts(reshapedPosts);
  }, [posts, users]);

  const openDrawer = () => setIsDrawerOpened(true);
  const closeDrawer = () => setIsDrawerOpened(false);

  return (
    <>
      <TopBar openDrawer={openDrawer} />
      <Stack direction="row" spacing={desktopUp ? 4 : undefined}>
        <Suspense fallback={<div />}>
          <Sidebar open={isDrawerOpened} handleClose={closeDrawer} />
        </Suspense>
        <Container
          disableGutters={desktopUp}
          component="main"
          maxWidth="md"
          sx={{
            pt: 11,
            "&.MuiContainer-maxWidthMd": {
              maxWidth: 700
            }
          }}
        >
          <Paper square variant="outlined" sx={{ px: 3, py: 1.5 }}>
            <Typography variant="h5" fontWeight={500} component="h1">
              Feed
            </Typography>
          </Paper>
          <Stack
            spacing={2}
            maxWidth={700}
            sx={{
              "& .MuiPaper-rounded:first-of-type": {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
              }
            }}
          >
            {userPosts?.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </Stack>
        </Container>
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
                {communities.map(({ id, name, path }) => (
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
      </Stack>
      {!tabletUp && <BottomNav />}
    </>
  );
};

export default Feed;
