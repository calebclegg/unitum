import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useData, usePostsActions, useUser } from "../hooks";
import PostCard, { IProps as IPost } from "./PostCard";
import { Link, useSearchParams } from "react-router-dom";

const UserPosts = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const { data: posts, mutate } = useData<IPost[]>("users/me/posts");
  const [activeTab, setActiveTab] = useState("my-posts");
  const [userPosts, setUserPosts] = useState<IPost[] | null>(null);
  const { toggleVote } = usePostsActions(posts, mutate);

  useEffect(() => {
    const param = searchParams.get("tab");
    if (param) setActiveTab(param);
  }, [searchParams]);

  useEffect(() => {
    if (user && posts) {
      const postsWithAuthor = posts.map((post) => ({
        ...post,
        author: { profile: user.profile }
      }));

      setUserPosts(postsWithAuthor);
    }
  }, [user, posts]);

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ p: 0, my: 6, mx: "auto", borderRadius: 0, width: "fit-content" }}
      >
        <Tabs value={activeTab} aria-label="posts">
          <Tab
            value="my-posts"
            label="My Posts"
            component={Link}
            to="/profile?tab=my-posts"
          />
          <Tab
            value="saved-posts"
            label="Saved Posts"
            component={Link}
            to="/profile?tab=saved-posts"
          />
          <Tab
            value="school-works"
            label="School Works"
            component={Link}
            to="/profile?tab=school-works"
          />
        </Tabs>
      </Paper>
      <Stack id="my-posts" spacing={2}>
        {userPosts?.map((post) => (
          <PostCard key={post._id} {...post} toggleVote={toggleVote} />
        ))}
      </Stack>
    </>
  );
};

export default UserPosts;
