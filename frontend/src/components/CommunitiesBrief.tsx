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
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import { useUser } from "../hooks";

const CommunitiesBrief = () => {
  const { user } = useUser();
  const { pathname } = useLocation();

  const tabletLaptop = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.between("sm", "lg")
  );

  return (
    <Box
      position="relative"
      top={0}
      flexGrow={1}
      visibility={
        pathname !== "/feed" && !pathname.includes("/communities")
          ? "hidden"
          : "visible"
      }
      ml={tabletLaptop ? "0 !important" : undefined}
    >
      <Paper
        square
        id="communities"
        variant="outlined"
        component="section"
        sx={{
          mt: 11,
          position: "sticky",
          top: ({ spacing }) => spacing(11),
          width: "max-content"
        }}
      >
        <Typography variant="h6" component="h2">
          Communities
        </Typography>
        <List>
          {user?.profile.communities.map(({ _id, name, picture }) => (
            <ListItem
              key={_id}
              button
              component={Link}
              to={`/communities/${_id}`}
              sx={{ my: 2 }}
            >
              <ListItemAvatar>
                <Avatar src={picture} alt={name} variant="rounded" />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ sx: { whiteSpace: "nowrap" } }}
              >
                {name}
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
      </Paper>
    </Box>
  );
};

export default CommunitiesBrief;
