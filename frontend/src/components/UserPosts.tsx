import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useData, usePostsActions, useUser } from "../hooks";
import PostCard, { IProps as IPost } from "./PostCard";
import { Link, useSearchParams } from "react-router-dom";

const links = {
  "my-posts": "users/me/posts",
  "saved-posts": "users/me/savedPosts",
  "school-works": "users/me/schoolWork"
}

const UserPosts = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const { data: posts, mutate } = useData<IPost[]>("users/me/posts");
  const [activeTab, setActiveTab] = useState("my-posts");
  const [userPosts, setUserPosts] = useState<IPost[] | null>(null);
  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

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

  useEffect(() => {
    const { data: posts, mutate } = useData<IPost[]>("users/me/posts");
    
  }, [])

  const setNewActiveTab = (e: any) => {
      setActiveTab(e.target.value)
      console.log(activeTab)
  }

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
            onClick={setNewActiveTab}
          />
          <Tab
            value="saved-posts"
            label="Saved Posts"
            component={Link}
            onClick={setNewActiveTab}
            to="/profile?tab=saved-posts"
          />
          <Tab
            value="school-works"
            label="School Works"
            component={Link}
            onClick={setNewActiveTab}
            to="/profile?tab=school-works"
          />
        </Tabs>
      </Paper>
      <Stack id="my-posts" spacing={2}>
        {userPosts?.map((post) => (
          <PostCard
            {...post}
            key={post._id}
            toggleSave={toggleSave}
            toggleVote={toggleVote}
          />
        ))}
      </Stack>
    </>
  );
};

export default UserPosts;
