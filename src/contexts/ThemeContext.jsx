import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
// import { cyan, teal } from '@mui/material/colors'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
})

const getTheme = () => {
  const theme = localStorage.getItem('theme')
  if (theme) {
    return theme
  } else {
    return 'dark'
  }
}

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = React.useState(getTheme())
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light'
          localStorage.setItem('theme', newMode)
          return newMode
        })
      },
      mode,
    }),
    [mode]
  )

  let theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // primary: cyan,
          // secondary: teal,
        },
      }),
    [mode]
  )
  theme = responsiveFontSizes(theme)
  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}

export { ThemeProvider, ColorModeContext }
