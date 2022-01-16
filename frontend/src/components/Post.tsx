import Card from "@mui/material/Card";

interface IProps {
  upvotes: number;
  author: string;
  publishedDate: string;
  comments: number;
  content: string;
}

const Post = ({
  author,
  upvotes,
  content,
  comments,
  publishedDate
}: IProps) => {
  return <Card variant="outlined"></Card>;
};

export default Post;
