/* eslint-disable react/prop-types */
import { PanelResizeHandle } from 'react-resizable-panels'

const HorizontalResizeHandle = ({ id }) => (
  <PanelResizeHandle className='HorizontalResizeHandleOuter' id={id}>
    <div className='HorizontalResizeHandleInner' />
  </PanelResizeHandle>
)

export default HorizontalResizeHandle
