import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../lib";
import { getUrl } from "../utils";
import { useUser } from "../hooks";
import { useAuth } from "../context/Auth";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditEducation = () => {
  const { token } = useAuth();
  const { user, updateUser } = useUser();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [updating, setUpdating] = useState(false);
  const open = hash === "#edit-education";

  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );

  useEffect(() => {
    const education = user?.profile?.education;

    if (education) {
      education.endDate && setEndDate(new Date(education.endDate));
      education.startDate && setStartDate(new Date(education.startDate));
    }
  }, [user?.profile.education]);

  const handleClose = () => {
    navigate(getUrl().replace(hash, ""));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const requestBody = Object.fromEntries(formData.entries());
    const data: Record<string, any> = {};
    if (requestBody.schoolName) {
      data["school"] = {
        name: requestBody.schoolName
      };
    }
    if (requestBody.url) {
      data["school"] = {
        ...data.school,
        url: requestBody.url
      };
    }

    console.log({
      ...data,
      startDate,
      endDate,
      fieldOfStudy: requestBody.fieldOfStudy,
      degree: requestBody.degree,
      grade: requestBody.grade
    });
    try {
      setUpdating(true);

      await API.patch(
        "users/me/education",
        {
          ...data,
          startDate,
          endDate,
          fieldOfStudy: requestBody.fieldOfStudy,
          degree: requestBody.degree,
          grade: requestBody.grade
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      updateUser();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        id: "edit-education",
        sx: {
          width: ({ breakpoints }) => `min(${breakpoints.values.sm}px, 100%)`
        }
      }}
      fullScreen={!tabletUp}
      TransitionComponent={tabletUp ? undefined : Transition}
    >
      <form method="post" action="#" onSubmit={handleSubmit}>
        <Stack>
          <DialogTitle>Update Education Info</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              fullWidth
              id="school-name"
              label="School Name"
              name="schoolName"
              margin="normal"
              defaultValue={user?.profile?.education?.school.name}
            />
            <TextField
              id="school-site"
              fullWidth
              type="url"
              name="url"
              label="Website"
              margin="normal"
              defaultValue={user?.profile.education?.school.url}
            />
            <TextField
              fullWidth
              id="degree"
              name="degree"
              label="Degree"
              margin="normal"
              defaultValue={user?.profile.education?.degree}
            />
            <TextField
              fullWidth
              id="field-of-study"
              name="fieldOfStudy"
              label="Field Of Study"
              margin="normal"
              defaultValue={user?.profile.education?.fieldOfStudy}
            />
            <TextField
              fullWidth
              id="grade"
              name="grade"
              label="Grade"
              margin="normal"
              defaultValue={user?.profile.education?.grade}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
          </DialogContent>
        </Stack>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={updating}>
            Save Changes
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditEducation;
