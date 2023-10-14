/* eslint-disable react/prop-types */
import { PanelResizeHandle } from 'react-resizable-panels'

import styles from './styles.module.css'

export default function ResizeHandle({ className = '', id }) {
  return (
    <PanelResizeHandle
      className={[styles.ResizeHandleOuter, className].join(' ')}
      id={id}
    >
      <div className={styles.ResizeHandleInner}></div>
    </PanelResizeHandle>
  )
}
