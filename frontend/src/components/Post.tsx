import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

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
  return (
    <Card variant="outlined">
      <CardHeader>
        <Typography></Typography>
        <Typography></Typography>
      </CardHeader>
      <CardContent></CardContent>
      <CardActions></CardActions>
    </Card>
  );
};

export default Post;
