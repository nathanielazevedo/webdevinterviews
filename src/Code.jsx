import { Sandpack } from '@codesandbox/sandpack-react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import rows from './problems/react'
import { Typography, Box, Button } from '@mui/material'
import Rating from './Rating'

const App = () => {
  const files = {
    '/App.js': `export default function App() {
  return <h1>Web Dev Interviews</h1>
}`,
  }
  const navigate = useNavigate()
  let { filter, name } = useParams()

  const challenge = rows.filter((row) => row.name === name)[0]

  return (
    <>
      <Box style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Button
          variant='contained'
          style={{ cursor: 'pointer', height: '30px' }}
          onClick={() => {
            navigate('/workouts/' + filter)
          }}
        >
          <ArrowBackIcon />
        </Button>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          {challenge.title}
        </Typography>
        <Rating rating={challenge.difficulty} />
      </Box>
      <Typography mt={3} mb={3}>
        {challenge.description}
      </Typography>
      <Sandpack
        files={files}
        theme={{
          colors: {
            surface1: '#151515',
            surface2: '#252525',
            surface3: '#2F2F2F',
            clickable: '#999999',
            base: '#808080',
            disabled: '#4D4D4D',
            hover: '#C5C5C5',
            accent: '#19e4ff',
            error: '#a33aff',
            errorSurface: '#f6ebff',
          },
          syntax: {
            plain: '#FFFFFF',
            comment: {
              color: '#757575',
              fontStyle: 'italic',
            },
            keyword: '#19e4ff',
            tag: '#4ffd4f',
            punctuation: '#ffffff',
            definition: '#a3f4ff',
            property: '#19e4ff',
            static: '#a33aff',
            string: '#03fc03',
          },
          font: {
            body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
            size: '13px',
            lineHeight: '20px',
          },
        }}
        template='react'
        options={{
          layout: 'preview', // preview | tests | console
          showNavigator: true,
          showTabs: true,
          closableTabs: true,
          editorHeight: 500,
          showConsole: true,
          showConsoleButton: true,
          showLineNumbers: true,
        }}
      />
    </>
  )
}

export default App
