import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import { LogProvider } from './pages/LogContext'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#19e4ff',
    },
  },
  typography: {
    fontFamily: 'Bai Jamjuree',
  },
  variables: {
    sideNavWidth: '240px',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#212121',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ThemeProvider theme={darkTheme}>
      <LogProvider>
        <CssBaseline />
        <App />
      </LogProvider>
    </ThemeProvider>
  </>
)
