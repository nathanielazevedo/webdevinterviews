import ReactDOM from 'react-dom/client'
import './styles/index.css'
import theme from './styles/theme'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import Router from './Router'
import { AuthProvider } from './contexts/AuthContext'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <CssBaseline />
      <Router />
    </AuthProvider>
  </ThemeProvider>
)
