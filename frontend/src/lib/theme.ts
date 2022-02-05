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
      },
      text: {
        primary: "#2C2D4D"
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
      variant: "contained",
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
        padding: theme.spacing(2)
      },
      rounded: {
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

export const darkTheme = createTheme(theme, {
  palette: {
    mode: "dark",
    text: {
      primary: theme.palette.grey[100],
      secondary: theme.palette.grey[300]
    }
  }
});

export const lightTheme = createTheme(theme, {
  palette: {
    mode: "light",
    text: {
      primary: theme.palette.text.primary,
      secondary: theme.palette.text.secondary
    }
  }
});
