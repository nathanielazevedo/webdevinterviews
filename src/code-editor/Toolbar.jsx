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
        backgroundColor: '#181818',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '0 10px',
        borderBottom: '1px solid black',
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
