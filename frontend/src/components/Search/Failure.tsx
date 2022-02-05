import WarningIcon from "@mui/icons-material/Warning";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface IProps {
  errorMessage?: string;
  errorStatus?: number;
}

const Failure = ({ errorMessage, errorStatus }: IProps) => {
  if (!errorMessage) return null;

  return (
    <Stack alignItems="center" spacing={1} my={6}>
      <WarningIcon sx={{ width: 120, height: 120, color: "grey.400" }} />
      <Typography
        align="center"
        component="p"
        variant="h5"
        color="textSecondary"
      >
        Oops! {errorMessage}
      </Typography>
      {errorStatus === 404 && (
        <Typography align="center" color="textSecondary">
          Type something else
        </Typography>
      )}
    </Stack>
  );
};

export default Failure;
