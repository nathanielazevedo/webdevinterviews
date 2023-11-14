/* eslint-disable react/prop-types */
import { PanelResizeHandle } from 'react-resizable-panels'

export default function ResizeHandle({ id }) {
  return (
    <PanelResizeHandle className='HorizontalResizeHandleOuter' id={id}>
      <div className='HorizontalResizeHandleInner'></div>
    </PanelResizeHandle>
  )
}
