/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import ToolbarItems from './ToolbarItems'

const Toolbar = ({ setCode, codemirrorInstance, challenge, demo }) => {
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
        challenge={challenge}
        codemirrorInstance={codemirrorInstance}
      />
    </Box>
  )
}

export default Toolbar
