import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

const Search = () => {
  return (
    <OutlinedInput
      id="search-combo-box"
      type="search"
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon color="action" fontSize="small" />
        </InputAdornment>
      }
      inputProps={{
        placeholder: "Search for posts, users and communities",
        "aria-label": "Search for posts, users and communities"
      }}
      sx={{
        width: 300,
        bgcolor: "#fff5",
        transition: ({ transitions }) =>
          transitions.create(["background-color", "width"], {
            easing: transitions.easing.easeOut,
            duration: transitions.duration.short
          }),

        "&.Mui-focused": {
          width: 400,
          bgcolor: "#fffa",
          borderColor: "grey.100"
        },
        "& input.MuiOutlinedInput-input": {
          py: 1,
          color: ({ palette }) => palette.grey[800]
        }
      }}
    />
  );
};

export default Search;
