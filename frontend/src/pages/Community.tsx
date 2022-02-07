import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PostCard, { IProps as IPost } from "../components/PostCard";
import { ICommunity, useData, usePostsActions, useUser } from "../hooks";

const Community = () => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { user } = useUser();
  const { data: community } = useData<ICommunity>(`community/${comm_id}`);
  const { data: posts, mutate } = useData<IPost[]>(
    `posts?communityID=${comm_id}`
  );

  // const isMember = user ? community?.members.includes(user._id) : false;

  const { toggleSave, toggleVote } = usePostsActions(posts, mutate);

  return (
    <>
      <Stack py={5} px={3} alignItems="flex-start" spacing={2}>
        <Typography variant="h4" component="h1">
          {community?.name}
        </Typography>
        <Button>Join Community</Button>
      </Stack>
      <Stack
        spacing={2}
        width="100%"
        mb={6}
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
  );
};

export default Community;
