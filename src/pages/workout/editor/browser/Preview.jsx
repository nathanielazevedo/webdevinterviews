import { useContext, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import {
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  SandpackThemeProvider,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { WorkoutContext } from '../../../../contexts/WorkoutContext'
import Console from './Console'

const BasicTabs = () => {
  const [value, setValue] = useState(0)
  const { workout } = useContext(WorkoutContext)
  const { sandpack } = useSandpack()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', height: 'calc(100% - 40px)' }}>
      <Box sx={{ backgroundColor: '#151515' }}>
        <Tabs value={value} onChange={handleChange} sx={{ minHeight: '40px' }}>
          {['Details', 'Console', 'Tests', 'Example', 'Video'].map((label) => (
            <Tab
              key={label}
              label={label}
              style={{ minWidth: 50, fontSize: 12, minHeight: 30 }}
            />
          ))}
        </Tabs>
      </Box>

      {value === 0 && (
        <div
          dangerouslySetInnerHTML={{
            __html: sandpack?.files['/shared/Instructions.html']?.code ?? '',
          }}
        />
      )}

      {value === 1 && <Console />}

      {value === 2 && <SandpackTests style={{ height: '100%' }} />}

      {value === 3 && (
        <div style={{ height: '100%' }}>
          <SandpackProvider
            files={workout.solution}
            template={workout.sp_template}
          >
            <SandpackThemeProvider theme={'dark'}>
              <SandpackPreview
                showNavigator
                style={{ height: '100%' }}
                showOpenInCodeSandbox={false}
              />
            </SandpackThemeProvider>
          </SandpackProvider>
        </div>
      )}

      {value === 4 && (
        <iframe
          width='100%'
          height='100%'
          src={workout.embed_link}
          title='YouTube video player'
          frameborder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowfullscreen
        ></iframe>
      )}
    </Box>
  )
}

export default BasicTabs
