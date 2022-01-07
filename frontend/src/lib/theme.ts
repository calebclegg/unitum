import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {
      navyBlue: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customPalette?: {
      navyBlue?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#416ECA"
    },
    secondary: {
      main: "#FFA014"
    },
    background: {
      default: "#F0EFF5"
    }
  },
  customPalette: {
    navyBlue: "#2C2D4D"
  },
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          textTransform: "none"
        }
      }
    }
  }
});
