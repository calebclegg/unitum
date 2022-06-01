import ExitToApp from "@mui/icons-material/ExitToApp";
import Person from "@mui/icons-material/Person";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useUser } from "../hooks";

const menuItems = [
  {
    path: "/profile",
    label: "My Profile",
    icon: <Person />
  }
];

interface IProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
}

const MenuOptions = ({ anchorEl, handleClose }: IProps) => {
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={handleClose}
      PaperProps={{ sx: { p: 0 } }}
      sx={{
        "& .MuiMenuItem-gutters": {
          px: 1,
          mx: 1,
          borderRadius: 1,

          "&:not(:last-child)": {
            mb: 1
          }
        }
      }}
    >
      {menuItems.map(({ path, label, icon }) => (
        <MenuItem key={path} component={Link} to={path} onClick={handleClose}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
      <Divider variant="middle" light />
      <MenuItem
        onClick={handleLogout}
        sx={{
          "& .MuiListItemText-primary, & .MuiListItemIcon-root": {
            color: "error.main"
          },

          "&.Mui-focusVisible": {
            bgcolor: ({ palette }) => alpha(palette.error.light, 0.1)
          }
        }}
      >
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default MenuOptions;
