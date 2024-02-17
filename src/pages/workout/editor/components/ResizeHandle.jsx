/* eslint-disable react/prop-types */
import { PanelResizeHandle } from 'react-resizable-panels'

const ResizeHandle = ({ id }) => (
  <PanelResizeHandle className='ResizeHandleOuter' id={id}>
    <div className='ResizeHandleInner' />
  </PanelResizeHandle>
)

export default ResizeHandle
