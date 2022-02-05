import Helmet from "react-helmet";
import Edit from "@mui/icons-material/Edit";
import Link from "@mui/icons-material/Link";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/system/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useUser } from "../hooks";
import UserPosts from "../components/UserPosts";

const Profile = () => {
  const { user } = useUser();

  return (
    <>
      <Helmet>
        <title>{`${user?.profile.fullName} | Profile`}</title>
      </Helmet>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Avatar
            variant="rounded"
            src={user?.profile.picture}
            alt={user?.profile.fullName}
            sx={{ width: "100%", borderRadius: 3, minHeight: 100 }}
          />
        </Grid>
        <Grid
          item
          xs={8}
          container
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight="500" component="h1">
              {user?.profile.fullName}
            </Typography>
            <Chip
              label={`Unicoyn ${user?.profile.unicoyn}`}
              sx={{ width: "fit-content" }}
            />
          </Stack>
          <IconButton>
            <Edit />
          </IconButton>
        </Grid>
      </Grid>
      <Box id="education" mt={4} mb={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" fontWeight={500} component="h2">
            Education
          </Typography>
          <IconButton size="small">
            <Edit fontSize="small" />
          </IconButton>
        </Stack>
        <Stack direction="row" my={2}>
          <div>
            <Typography variant="caption" color="textSecondary">
              School
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                University of Mines and Technology
              </Typography>
              <IconButton size="small" color="primary" href="#">
                <Link fontSize="small" />
              </IconButton>
            </Stack>
          </div>
        </Stack>
        <Stack direction="row" my={2} justifyContent="space-between">
          <div>
            <Typography variant="caption" color="textSecondary">
              Field of Study
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">Computer Science</Typography>
            </Stack>
          </div>
        </Stack>
        <Stack direction="row" my={2} justifyContent="space-between">
          <div>
            <Typography variant="caption" color="textSecondary">
              Degree
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                Bachelor&apos;s Degree
              </Typography>
            </Stack>
          </div>
          <Stack alignItems="flex-end">
            <Typography variant="caption" color="textSecondary" align="right">
              Grade
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">{70}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" my={2} justifyContent="space-between">
          <div>
            <Typography variant="caption" color="textSecondary">
              Start Date
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                {new Date().toLocaleDateString()}
              </Typography>
            </Stack>
          </div>
          <Stack alignItems="flex-end">
            <Typography variant="caption" color="textSecondary" align="right">
              End Date
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                {new Date().toLocaleDateString()}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <UserPosts />
    </>
  );
};

export default Profile;
