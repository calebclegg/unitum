import { Link, useLocation } from "react-router-dom";
import Box from "@mui/system/Box";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import MuiLink from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import { useUser } from "../hooks";

const CommunitiesBrief = () => {
  const { user } = useUser();
  const { pathname } = useLocation();

  const tabletLaptop = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.between("sm", "lg")
  );
  const laptopUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("md")
  );

  return (
    <Box
      position="relative"
      top={0}
      flexGrow={1}
      visibility={pathname !== "/feed" ? "hidden" : "visible"}
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
          width: "max-content",
          maxWidth: laptopUp ? undefined : 300
        }}
      >
        <Typography variant="h6" component="h2">
          Communities
        </Typography>
        <List>
          {user?.profile.communities.map(({ id, name, path }) => (
            <ListItem
              key={id}
              button
              component={Link}
              to={`/communities/${path}`}
              sx={{ my: 2 }}
            >
              <ListItemAvatar>
                <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ sx: { whiteSpace: "nowrap" } }}
              >
                {name}
              </ListItemText>
              <Typography
                variant="caption"
                fontSize="0.5rem"
                sx={{
                  ml: 4,
                  color: "grey.100",
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "grid",
                  placeItems: "center"
                }}
              >
                {Math.floor(Math.random() * 100)}
              </Typography>
            </ListItem>
          ))}
        </List>
        <MuiLink component={Link} to="/communities">
          See all communities
        </MuiLink>
      </Paper>
    </Box>
  );
};

export default CommunitiesBrief;
