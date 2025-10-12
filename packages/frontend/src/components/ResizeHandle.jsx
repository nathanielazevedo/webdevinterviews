import { Box } from '@mui/material'
import { PanelResizeHandle } from 'react-resizable-panels'

const ResizeHandle = ({ horz }) => (
  <PanelResizeHandle
    className={horz ? 'HorizontalResizeHandleOuter' : 'ResizeHandleOuter'}
  >
    <Box
      sx={{
        position: 'absolute',
        top: ' 0',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'divider',
        ':active': {
          backgroundColor: 'primary.main',
        },
      }}
    />
  </PanelResizeHandle>
)

export default ResizeHandle
