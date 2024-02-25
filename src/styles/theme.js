import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#19e4ff',
    },
    divider: '#454950',
    background: {
      paper: 'black',
      default: 'black',
    },
  },
  typography: {
    fontFamily: 'Bai Jamjuree',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#212121',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: 'black',
          // borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'black',
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#212121',
          backgroundImage: 'none',
        },
      },
    },
  },
})
