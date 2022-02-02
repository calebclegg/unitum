import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { useUser } from "../hooks";
import { fetcher } from "../utils";

const Post = () => {
  const { token } = useUser();
  const { post_id } = useParams<{ post_id: string }>();
  const { data: post } = useSWR(
    token ? [`posts/${post_id}`, token] : null,
    fetcher
  );
  console.log({ post });

  return (
    <Dialog open={Boolean(post_id)} fullScreen>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Typography>{post?.body}</Typography>
          <section id="comments"></section>
        </CardContent>
      </Card>
    </Dialog>
  );
};

export default Post;
