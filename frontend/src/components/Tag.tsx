import Chip from "@mui/material/Chip";

const colors = {
  post: "primary",
  user: "error",
  community: "success"
};

type TColors = "primary" | "error" | "success";

const Tag = ({ type }: { type: "post" | "user" | "community" }) => {
  return (
    <Chip
      label={type}
      variant="outlined"
      color={colors[type] as TColors}
      sx={{ height: 20, borderRadius: 0.5 }}
    />
  );
};

export default Tag;
