import { Link, useLocation } from "react-router-dom";
import Add from "@mui/icons-material/Add";
import Box from "@mui/system/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { useUser } from "../hooks";

const CommunitiesBrief = () => {
  const { user } = useUser();
  const { pathname } = useLocation();

  return (
    <>
      <Typography sx={{ fontWeight: "bold" }}>Communities</Typography>
      <List>
        {user?.profile.communities.map(({ _id, name, picture }) => (
          <ListItem
            key={_id}
            button
            component={Link}
            to={`/communities/${_id}`}
            sx={{ mb: 1 }}
          >
            <ListItemAvatar>
              <Avatar src={picture} alt={name} variant="rounded" />
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{ sx: { whiteSpace: "nowrap" } }}
            >
              <small>{name}</small>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      {pathname === "/communities" ? (
        <Button fullWidth startIcon={<Add />} href="#create-community">
          Create Community
        </Button>
      ) : (
        <MuiLink component={Link} to="/communities">
          See all communities
        </MuiLink>
      )}
    </>
  );
};

export default CommunitiesBrief;
