import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useData, usePostsActions, useUser } from "../hooks";
import PostCard, { IProps as IPost } from "./PostCard";
import { Link, useSearchParams } from "react-router-dom";
import SchoolWorkCard from "./SchoolWorkCard";

const links: Record<string, string> = {
  "my-posts": "users/me/posts",
  "saved-posts": "users/me/savedPosts",
  "school-works": "users/me/schoolWork"
};

const UserPosts = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { data: posts, mutate: updatePosts } = useData<IPost[]>(
    tab === "my-posts" ? links[tab] : null
  );
  const { data: saved, mutate: updateSaved } = useData<IPost[]>(
    tab === "saved-posts" ? links[tab] : null
  );
  const { data: works, mutate: updateWorks } = useData<IPost[]>(
    tab === "school-works" ? links[tab] : null
  );
  const [activeTab, setActiveTab] = useState("my-posts");
  const [userPosts, setUserPosts] = useState<IPost[] | null>(null);
  const { toggleSave, toggleVote } = usePostsActions(posts, updateSaved);
  // const { toggleSave, toggleVote } = usePostsActions(posts, updatePosts);

  useEffect(() => {
    const param = searchParams.get("tab");
    if (param) setActiveTab(param);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "saved-posts") {
      const savedPosts = saved?.map((post) => {
        return { ...post, saved: true };
      });
      savedPosts ? setUserPosts(savedPosts) : null;
    } else if (activeTab == "school-works") {
      setUserPosts(works);
    } else {
      setUserPosts(posts);
    }
  }, [user, activeTab]);

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
        {activeTab === "school-works"
          ? userPosts?.map((post) => (
              <SchoolWorkCard {...post} key={post._id} />
            ))
          : userPosts?.map((post) => (
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
