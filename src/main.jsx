import './index.css'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import Router from './Router'
import { LogProvider } from './pages/LogContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <LogProvider>
      <CssBaseline />
      <Router />
    </LogProvider>
  </ThemeProvider>
)
