// src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

// Creditsafe color palette based on the provided theme
const creditsafeColors = {
  // Primary colors
  logoRed: '#E41F13',
  blue1: '#12667D',
  blue2: '#1783A0',
  blue3: '#45B1CD',
  mediumBlue: '#1783A0',
  darkestBlue: '#12667D',
  lightestBlue: '#97D3E3',
  
  // Status colors
  greenPrimary: '#4DBA82',
  green2: '#72bb53',
  green3: '#87E387',
  green4: '#4c7a34',
  redPrimary: '#E41F13',
  amber: '#ffa834',
  yellow: '#F4EB49',
  

  
  // UI colors
  greyLight1: '#eeeeee',
  greyAdobe1: '#929292',
  paleGrey: '#dddddd',
  lightGrey: '#7A7A7A',
  
  // Notification colors
  notificationBlue: '#add8e6',
  successToast: '#ADD9E6',
  errorToast: '#F7A09B',
  
  // Background colors
  containerBackgroundBlue: '#e5effd',
  identityInformationHeading: '#ebf6fa',
  
  // Typography
  black: '#000000',
  disabled: '#0000001E',
  disableButtonText: '#00000057',
};

export const creditsafeTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 960,
      xl: 1280,
    },
  },
  palette: {
    primary: {
      main: creditsafeColors.mediumBlue,
      light: creditsafeColors.blue3,
      dark: creditsafeColors.darkestBlue,
      contrastText: '#ffffff',
    },
    secondary: {
      main: creditsafeColors.logoRed,
      light: '#ff5983',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    success: {
      main: creditsafeColors.greenPrimary,
      light: creditsafeColors.green3,
      dark: creditsafeColors.green4,
    },
    warning: {
      main: creditsafeColors.amber,
      light: creditsafeColors.yellow,
      dark: '#e68900',
    },
    error: {
      main: creditsafeColors.redPrimary,
      light: creditsafeColors.errorToast,
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: creditsafeColors.black,
      secondary: creditsafeColors.lightGrey,
    },
    grey: {
      50: '#fafafa',
      100: creditsafeColors.greyLight1,
      200: creditsafeColors.paleGrey,
      300: '#c0c0c0',
      400: creditsafeColors.greyAdobe1,
      500: creditsafeColors.lightGrey,
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  typography: {
    htmlFontSize: 10,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 12,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: creditsafeColors.mediumBlue,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: creditsafeColors.mediumBlue,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: creditsafeColors.mediumBlue,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
        containedPrimary: {
          backgroundColor: creditsafeColors.mediumBlue,
          '&:hover': {
            backgroundColor: creditsafeColors.darkestBlue,
          },
        },
        containedSecondary: {
          backgroundColor: creditsafeColors.logoRed,
          '&:hover': {
            backgroundColor: '#c51162',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: creditsafeColors.mediumBlue,
            },
            '&.Mui-focused fieldset': {
              borderColor: creditsafeColors.mediumBlue,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: creditsafeColors.mediumBlue,
          color: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: creditsafeColors.mediumBlue,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: creditsafeColors.darkestBlue,
            },
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        elevation3: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: creditsafeColors.mediumBlue,
          color: '#ffffff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
        colorPrimary: {
          backgroundColor: creditsafeColors.containerBackgroundBlue,
          color: creditsafeColors.mediumBlue,
        },
        colorSecondary: {
          backgroundColor: creditsafeColors.errorToast,
          color: creditsafeColors.redPrimary,
        },
      },
    },
  },
});

// Export color palette for use in components
export const creditsafeColorPalette = creditsafeColors;