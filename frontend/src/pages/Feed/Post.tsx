import useSWR from "swr";
import { useParams } from "react-router-dom";
import { fetcher } from "../../utils";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useSWR(`posts/${id}`, fetcher);

  return <pre>{JSON.stringify(data, undefined, 2)}</pre>;
};

export default Post;
