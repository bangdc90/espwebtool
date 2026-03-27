import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#1d1d1f',
    },
    primary: {
      main: '#0071e3',
      light: '#2997ff',
      dark: '#0058b0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6e6e73',
      light: '#a1a1a6',
      dark: '#3d3d40',
      contrastText: '#fff',
    },
    success: {
      main: '#34c759',
    },
    warning: {
      main: '#ff9f0a',
    },
    error: {
      main: '#ff453a',
    },
    divider: 'rgba(255,255,255,0.1)',
    text: {
      primary: '#f5f5f7',
      secondary: '#6e6e73',
      disabled: 'rgba(245,245,247,0.3)',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { letterSpacing: '-0.01em' },
    body2: { letterSpacing: '-0.01em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          scrollbarColor: 'rgba(255,255,255,0.15) transparent',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 3,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1d1d1f',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(255,255,255,0.18)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: '#0071e3',
          '&:hover': { background: '#0077ed' },
          '&:active': { background: '#006edb' },
        },
        containedSecondary: {
          background: '#3a3a3c',
          '&:hover': { background: '#48484a' },
        },
        outlinedPrimary: {
          borderColor: 'rgba(255,255,255,0.2)',
          color: '#f5f5f7',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.35)',
            background: 'rgba(255,255,255,0.05)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#1d1d1f',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: '#f5f5f7',
          height: 2,
          borderRadius: 1,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          letterSpacing: '-0.01em',
          color: '#6e6e73',
          '&.Mui-selected': {
            color: '#f5f5f7',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.15)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0071e3',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
})

export default theme
