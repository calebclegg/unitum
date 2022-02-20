// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DatePicker from "@mui/lab/DatePicker";
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
import { useLocation, useNavigate } from "react-router-dom";
import { getUrl } from "../utils";
import { forwardRef, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Theme } from "@mui/material/styles";
import { useUser } from "../hooks";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  updating: boolean;
  update: (event: React.FormEvent<HTMLFormElement>) => void;
}

const EditEducation = ({ update, updating }: IProps) => {
  const { user } = useUser();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const tabletUp = useMediaQuery(({ breakpoints }: Theme) =>
    breakpoints.up("sm")
  );

  const open = hash === "#edit-education";

  const handleClose = () => {
    navigate(getUrl().replace(hash, ""));
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
      <form method="post" action="#" onSubmit={update}>
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
            />
            <TextField
              id="school-site"
              fullWidth
              type="url"
              name="website"
              label="Website"
              margin="normal"
            />
            <TextField
              fullWidth
              id="field-of-study"
              name="fieldOfStudy"
              label="Field Of Study"
              margin="normal"
            />
            <TextField
              fullWidth
              id="bachelor"
              name="bachelor"
              label="Bachelor"
              margin="normal"
            />
            <TextField
              fullWidth
              id="grade"
              name="grade"
              label="Grade"
              margin="normal"
            />
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            </LocalizationProvider> */}
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
