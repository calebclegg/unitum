import { useSearchParams } from "react-router-dom";
import { debounce } from "@mui/material/utils";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

const MobileInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const searchParams = new URLSearchParams(window.location.search);
    value ? searchParams.set("keyword", value) : searchParams.delete("keyword");
    setSearchParams(searchParams.toString(), { replace: true, state: value });
  };

  return (
    <OutlinedInput
      id="search-combo-box"
      type="search"
      defaultValue={searchParams.get("keyword")}
      onChange={debounce(handleChange, 600)}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon color="action" fontSize="small" />
        </InputAdornment>
      }
      autoComplete="off"
      inputProps={{
        placeholder: "Search for posts, users and communities"
      }}
      sx={{
        width: "100%",
        bgcolor: "#fffa",
        "& .MuiOutlinedInput-input": {
          py: 1,
          color: ({ palette }) => palette.grey[800]
        }
      }}
    />
  );
};

export default MobileInput;
