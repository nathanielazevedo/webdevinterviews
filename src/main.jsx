import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
// import { Analytics } from '@vercel/analytics/react'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'

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
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {/* <Analytics /> */}
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </>
)
