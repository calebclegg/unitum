import { lazy, Suspense, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import { useDisplaySize } from "../hooks";
import Post, { IProps } from "../components/Post";
import useSWR from "swr";
import axios from "axios";

const fetcher = async (endpoint: string) =>
  await (
    await axios.get(`https://jsonplaceholder.typicode.com/${endpoint}`)
  ).data;

const Sidebar = lazy(() => import("../components/Sidebar"));

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
      <Stack direction="row" spacing={4}>
        <Suspense fallback={<div />}>
          <Sidebar open={isDrawerOpened} handleClose={closeDrawer} />
        </Suspense>
        <Container
          disableGutters={desktopUp}
          component="main"
          maxWidth="md"
          sx={{ pt: 11 }}
        >
          <Paper
            square
            variant="outlined"
            sx={{ px: 3, py: 1.5, maxWidth: 700 }}
          >
            <Typography variant="h5" fontWeight={500} component="h1">
              Feed
            </Typography>
          </Paper>
          <Stack
            spacing={2}
            maxWidth={700}
            sx={{
              "& .MuiPaper-rounded:first-child": {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
              }
            }}
          >
            {userPosts?.map(({ id, ...post }) => (
              <Post key={id} {...post} />
            ))}
          </Stack>
        </Container>
      </Stack>
      {!tabletUp && <BottomNav />}
    </>
  );
};

export default Feed;
