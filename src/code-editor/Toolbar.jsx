/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import ToolbarItems from './ToolbarItems'

const Toolbar = ({
  setCode,
  codemirrorInstance,
  challenge,
  demo,
  autoSave,
  setAutoSave,
}) => {
  return (
    <Box
      sx={{
        height: '3vh',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '0 10px',
      }}
    >
      <ToolbarItems
        demo={demo}
        setCode={setCode}
        autoSave={autoSave}
        challenge={challenge}
        codemirrorInstance={codemirrorInstance}
        setAutoSave={setAutoSave}
      />
    </Box>
  )
}

export default Toolbar
