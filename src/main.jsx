import ReactDOM from 'react-dom/client'
import './styles/index.css'
import theme from './styles/theme'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import Router from './Router'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <CssBaseline />
      <Router />
    </AuthProvider>
  </ThemeProvider>
)
