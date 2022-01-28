import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface IProps {
  hasInput: boolean;
}

const Empty = ({ hasInput }: IProps) => {
  if (hasInput) return null;

  return (
    <Stack alignItems="center" spacing={1} my={6}>
      <SearchIcon sx={{ width: 120, height: 120, color: "grey.400" }} />
      <Typography variant="h5" align="center" color="textSecondary">
        Type something to search
      </Typography>
    </Stack>
  );
};

export default Empty;
