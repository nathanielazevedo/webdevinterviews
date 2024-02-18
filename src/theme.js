import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#19e4ff',
    },
    divider: '#454950',
  },
  typography: {
    fontFamily: 'Bai Jamjuree',
  },
  variables: {
    sideNavWidth: '70px',
    topNavHeight: '45px',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#212121',
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
