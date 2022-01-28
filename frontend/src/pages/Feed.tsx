import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Post, { IProps } from "../components/Post";
import useSWR from "swr";
import { fetcher } from "../utils";
import { useUser } from "../hooks";

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
  const { user } = useUser();
  const { data: posts } = useSWR<IPost[]>("posts", fetcher);
  const { data: users } = useSWR<IUser[]>("users", fetcher);
  const [userPosts, setUserPosts] = useState<IUserPost[] | null>(null);

  console.log({ user });

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

  return (
    <>
      <Paper square variant="outlined" sx={{ px: 3, py: 1.5, maxWidth: 700 }}>
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
          <Post key={post.id} {...post} />
        ))}
      </Stack>
    </>
  );
};

export default Feed;
