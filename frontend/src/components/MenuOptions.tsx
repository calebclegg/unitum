import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Link } from "react-router-dom";

const menuItems = [
  {
    path: "/profile",
    label: "My Profile",
    icon: <Person />
  },
  {
    path: "/account-setting",
    label: "Account Setting",
    icon: <Settings />
  }
];

interface IProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
}

const MenuOptions = ({ anchorEl, handleClose }: IProps) => {
  return (
    <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={handleClose}
      PaperProps={{ sx: { p: 0 } }}
    >
      {menuItems.map(({ path, label, icon }) => (
        <MenuItem key={path} component={Link} to={path}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default MenuOptions;
