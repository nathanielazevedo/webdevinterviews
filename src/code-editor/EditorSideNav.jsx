/* eslint-disable react/prop-types */
import { Box, Button } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'

const EditorSideNav = ({ filePanelRef }) => {
  const closeFilePanel = () => {
    if (filePanelRef.current) {
      if (filePanelRef.current.getSize() === 0) {
        filePanelRef.current.resize(10)
        return
      }
      filePanelRef.current.resize(0)
    }
  }

  return (
    <Box
      sx={{
        padding: '15px 2px',
        borderRight: '1px solid var(--color-solid-resize-bar)',
      }}
    >
      <Button sx={{ minWidth: '20px' }} onClick={closeFilePanel}>
        <FileCopyIcon
          style={{
            color: '#C5C5C5',
          }}
        />
      </Button>
    </Box>
  )
}

export default EditorSideNav
