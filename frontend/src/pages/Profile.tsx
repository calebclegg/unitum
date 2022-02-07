import Helmet from "react-helmet";
import Close from "@mui/icons-material/Close";
import Check from "@mui/icons-material/Check";
import Message from "@mui/icons-material/Message";
import Edit from "@mui/icons-material/Edit";
import Link from "@mui/icons-material/Link";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { lazy, Suspense, useRef, useState } from "react";
import { useUser } from "../hooks";
import UserPosts from "../components/UserPosts";

const EditEducation = lazy(() => import("../components/EditEducation"));

const Profile = () => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleMode = () => setEditMode(!editMode);

  const update = async () => {
    try {
      setUpdating(true);
      console.log("trying");
      toggleMode();
    } catch (error) {
      console.log(error);
    } finally {
      console.log("done");
      setUpdating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${user?.profile.fullName} | Profile`}</title>
      </Helmet>
      <Grid container spacing={2} alignItems="center">
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
            {editMode ? (
              <TextField
                name="fullName"
                label="Full Name"
                value={user?.profile.fullName}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="cancel"
                        onClick={toggleMode}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        aria-label="save"
                        onClick={update}
                      >
                        <Check fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& input": {
                    py: 1
                  }
                }}
              />
            ) : (
              <Typography variant="h4" fontWeight="500" component="h1">
                {user?.profile.fullName}
              </Typography>
            )}
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
          <IconButton aria-label="edit user name" onClick={toggleMode}>
            <Edit />
          </IconButton>
        </Grid>
      </Grid>
      <Box id="education" mt={4} mb={3} width="min(800px, 100%)">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" fontWeight={500} component="h2">
            Education
          </Typography>
          <IconButton
            size="small"
            href="#edit-education"
            aria-label="edit education"
          >
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
                {user?.profile.education.school.name}
              </Typography>
              <IconButton size="small" color="primary" href={user?.profile.education.school.url || "#"}>
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
              <Typography variant="subtitle1">{user?.profile.education.fieldOfStudy}</Typography>
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
                {user?.profile.education.degree || "---"}
              </Typography>
            </Stack>
          </div>
          <Stack alignItems="flex-end">
            <Typography variant="caption" color="textSecondary" align="right">
              Grade
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">{user?.profile.education.grade || "---"}</Typography>
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
              {user?.profile.education.startDate ? new Date(`${user?.profile.education.startDate}`).toLocaleDateString() : "---"}
              </Typography>
            </Stack>
          </div>
          <Stack alignItems="flex-end">
            <Typography variant="caption" color="textSecondary" align="right">
              End Date
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">
                {user?.profile.education.endDate ? new Date(`${user?.profile.education.endDate}`).toLocaleDateString() : "---"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <UserPosts />
      <Suspense fallback={<div />}>
        <EditEducation updating={updating} update={update} />
      </Suspense>
    </>
  );
};

export default Profile;
