import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import Tag from "../Tag";

interface IType {
  type: "post" | "user" | "community";
  color: "primary" | "success" | "error";
}

const resultTypes: IType[] = [
  {
    type: "post",
    color: "primary"
  },
  {
    type: "user",
    color: "error"
  },
  {
    type: "community",
    color: "success"
  }
];

interface IProps {
  anchorEl: HTMLDivElement | null;
}

const Result = ({ anchorEl }: IProps) => {
  const { transitions, zIndex } = useTheme();
  const paperRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    if (paperRef.current) {
      if (open) {
        paperRef.current.style.transform = `translateY(12.8px)`;
        paperRef.current.style.opacity = "1";
      } else {
        paperRef.current.style.transform = `translateY(0)`;
        paperRef.current.style.opacity = "0";
      }
    }
  }, [open]);

  const toggleFilter = (event: React.MouseEvent<HTMLDivElement>) => {
    const filter = event.currentTarget.textContent;

    filter &&
      setFilters((prevFilters) => {
        const newFilters = prevFilters.filter((f) => f !== filter);

        return newFilters.length === prevFilters.length
          ? [...prevFilters, filter]
          : newFilters;
      });
  };

  return (
    <Popper
      disablePortal
      open={open}
      role={undefined}
      anchorEl={anchorEl}
      style={{ zIndex: zIndex.modal }}
    >
      <Paper
        ref={paperRef}
        elevation={6}
        sx={{
          width: 400,
          opacity: 0,
          maxHeight: 510,
          overflowY: "auto",
          transform: "translateY(0)",
          borderTopLeftRadius: 0.2,
          borderTopRightRadius: 0.2,
          transition: transitions.create(["transform", "opacity"], {
            duration: transitions.duration.shortest,
            easing: transitions.easing.easeOut,
            delay: transitions.duration.short
          })
        }}
      >
        <Stack direction="row" spacing={1.5}>
          {resultTypes.map(({ type, color }) => (
            <Chip
              key={type}
              label={type}
              color={color}
              variant={filters.includes(type) ? "filled" : "outlined"}
              onClick={toggleFilter}
              sx={{
                height: 25,
                borderRadius: 0.5
              }}
            />
          ))}
        </Stack>
        <LinearProgress sx={{ my: 1.5 }} />
        <List role="listbox">
          {[1, 2, 3, 4].map((i) => (
            <ListItem key={i} role="option" id={`item-${i}`} button>
              <ListItemText
                primary={
                  <Typography>
                    ...ipsum dolor sit amet consectetur adipisicing elit...
                  </Typography>
                }
                secondary={<Tag />}
                disableTypography
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
};

export default Result;
