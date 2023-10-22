/* eslint-disable react/prop-types */
import { PanelResizeHandle } from 'react-resizable-panels'

export default function ResizeHandle({ id }) {
  return (
    <PanelResizeHandle className='ResizeHandleOuter' id={id}>
      <div className='ResizeHandleInner'></div>
    </PanelResizeHandle>
  )
}
