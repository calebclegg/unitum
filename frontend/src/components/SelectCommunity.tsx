import ImageIcon from "@mui/icons-material/Image";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MenuItemText from "@mui/material/ListItemText";
import MenuItemAvatar from "@mui/material/ListItemAvatar";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useUser } from "../hooks";
import { useParams } from "react-router-dom";

const SelectCommunity = () => {
  const { user } = useUser();
  const { comm_id } = useParams();

  return (
    <FormControl
      sx={{
        m: 1,
        mt: 3,

        "& .MuiOutlinedInput-root": {
          flexGrow: 1
        }
      }}
    >
      <InputLabel id="demo-simple-select-helper-label">
        Select Community
      </InputLabel>
      <Select
        MenuProps={{ PaperProps: { sx: { p: 0 } } }}
        inputProps={{
          id: "communities-options",
          name: "communityID",
          readOnly: Boolean(comm_id)
        }}
        defaultValue={comm_id || "wall"}
        label="Select Community"
        sx={({ breakpoints }) => ({
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center"
          },

          "& .MuiOutlinedInput-input": {
            [breakpoints.up("sm")]: {
              py: 1
            }
          }
        })}
      >
        <MenuItem value="wall">Post on my wall</MenuItem>
        {user?.profile.communities.map(({ _id, name, picture }) => (
          <MenuItem key={_id} value={_id}>
            <MenuItemAvatar sx={{ minWidth: 36 }}>
              <Avatar
                src={picture}
                alt={name}
                variant="rounded"
                sx={{ width: 24, height: 24 }}
              >
                <ImageIcon fontSize="small" />
              </Avatar>
            </MenuItemAvatar>
            <MenuItemText sx={{ my: 0 }}>{name}</MenuItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCommunity;
