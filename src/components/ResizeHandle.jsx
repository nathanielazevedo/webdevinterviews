/* eslint-disable react/prop-types */
import { PanelResizeHandle } from 'react-resizable-panels'

export default function ResizeHandle({ className = '', id }) {
  return (
    <PanelResizeHandle
      className={['ResizeHandleOuter', className].join(' ')}
      id={id}
    >
      <div
        className={['ResizeHandleInner', className].join(' ')}
        id='horz'
      ></div>
    </PanelResizeHandle>
  )
}
