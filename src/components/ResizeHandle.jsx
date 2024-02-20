import { PanelResizeHandle } from 'react-resizable-panels'

const ResizeHandle = ({ horz }) => (
  <PanelResizeHandle
    className={horz ? 'HorizontalResizeHandleOuter' : 'ResizeHandleOuter'}
  >
    <div className='ResizeHandleInner' />
  </PanelResizeHandle>
)

export default ResizeHandle
