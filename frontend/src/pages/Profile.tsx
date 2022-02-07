import Helmet from "react-helmet";
import Edit from "@mui/icons-material/Edit";
import Link from "@mui/icons-material/Link";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/system/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import { useUser } from "../hooks";
import UserPosts from "../components/UserPosts";
import { Message } from "@mui/icons-material";

const Profile = () => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  return (
    <>
      <Helmet>
        <title>{`${user?.profile.fullName} | Profile`}</title>
      </Helmet>
      <Grid container spacing={2} alignItems="center" marginTop={"1rem"}>
        <Grid item flexGrow="0 !important" width="fit-content" xs>
          <Avatar
            ref={avatarRef}
            variant="rounded"
            src={user?.profile.picture}
            alt={user?.profile.fullName}
            sx={{
              width: 100,
              height: avatarRef.current?.getBoundingClientRect().width,
              borderRadius: 3,
              minHeight: 100
            }}
          />
        </Grid>
        <Grid
          item
          xs
          container
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight="500" component="h1">
              {user?.profile.fullName}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button size="small" startIcon={<Message />}>
                Start Chat
              </Button>
              <Chip
                label={`Unicoyn ${user?.profile.unicoyn}`}
                sx={{ width: "fit-content" }}
              />
            </Stack>
          </Stack>
          <IconButton>
            <Edit />
          </IconButton>
        </Grid>
      </Grid>
      <Box id="education" mt={4} mb={3} width="min(800px, 100%)">
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
                {user?.profile.education?.school?.name || "---"}
              </Typography>
              <IconButton
                size="small"
                color="primary"
                href={user?.profile.education?.school?.url || "#"}
              >
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
              <Typography variant="subtitle1">
                {user?.profile.education?.fieldOfStudy || "---"}
              </Typography>
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
                {user?.profile.education?.degree || "---"}
              </Typography>
            </Stack>
          </div>
          <Stack alignItems="flex-end">
            <Typography variant="caption" color="textSecondary" align="right">
              Grade
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                {user?.profile.education?.grade || "---"}
              </Typography>
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
                {user?.profile.education?.startDate
                  ? new Date(
                      `${user?.profile.education?.startDate}`
                    ).toLocaleDateString()
                  : "---"}
              </Typography>
            </Stack>
          </div>
          <Stack alignItems="flex-end">
            <Typography variant="caption" color="textSecondary" align="right">
              End Date
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                {user?.profile.education?.endDate
                  ? new Date(
                      `${user?.profile.education?.endDate}`
                    ).toLocaleDateString()
                  : "---"}
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
