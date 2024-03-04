import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#19e4ff',
    },
    background: {
      paper: 'black',
      default: 'black',
    },
  },
  typography: {
    fontFamily: 'Bai Jamjuree',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: 'black',
          // borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    // MuiPaper: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: 'black',
    //       backgroundImage: 'none',
    //     },
    //   },
    // },
    // MuiDialog: {
    //   styleOverrides: {
    //     paper: {
    //       backgroundColor: '#212121',
    //       backgroundImage: 'none',
    //     },
    //   },
    // },
  },
})
