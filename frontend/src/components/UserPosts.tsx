import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import { useData, useUser } from "../hooks";
import PostCard, { IProps as IPost } from "./PostCard";

const UserPosts = () => {
  const { user } = useUser();
  const { data: posts, mutate } = useData<IPost[]>("users/me/posts");
  const [activeTab, setActiveTab] = useState(0);
  const [userPosts, setUserPosts] = useState<IPost[] | null>(null);

  useEffect(() => {
    if (user && posts) {
      const postsWithAuthor = posts.map((post) => ({
        ...post,
        author: { profile: user.profile }
      }));

      setUserPosts(postsWithAuthor);
    }
  }, [user, posts]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ p: 0, m: "auto", borderRadius: 0, width: "fit-content" }}
      >
        <Tabs value={activeTab} onChange={handleChange} aria-label="posts">
          <Tab label="My Posts" />
          <Tab label="Saved Posts" />
          <Tab label="School Works" />
        </Tabs>
      </Paper>
      <section id="my-posts">
        {userPosts?.map((post) => (
          <PostCard key={post._id} {...post} revalidate={mutate} />
        ))}
      </section>
    </>
  );
};

export default UserPosts;
