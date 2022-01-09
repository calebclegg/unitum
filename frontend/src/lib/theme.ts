import { createTheme, responsiveFontSizes } from "@mui/material/styles";

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

export const theme = responsiveFontSizes(
  createTheme({
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
    typography: {
      fontFamily: "'Inter', sans-serif"
    }
  })
);

theme.components = {
  MuiButton: {
    defaultProps: {
      disableElevation: true
    },
    styleOverrides: {
      root: {
        textTransform: "none"
      }
    }
  },
  MuiLink: {
    defaultProps: {
      underline: "hover"
    }
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        color: theme.customPalette.navyBlue
      }
    }
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0
    },
    styleOverrides: {
      root: {
        padding: theme.spacing(2),
        borderRadius: 8
      }
    }
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        color: theme.palette.text.secondary
      }
    }
  }
};
