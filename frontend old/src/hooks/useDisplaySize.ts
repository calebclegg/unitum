import { Breakpoint, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useDisplaySize = (breakpoint: Breakpoint) => {
  return useMediaQuery(({ breakpoints }: Theme) => breakpoints.up(breakpoint));
};
