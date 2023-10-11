// import { Box } from '@mui/material'
// // import { useEffect, useState } from 'react'
// import Video from './Video'
// import videos from './yt'

// const YouTube = () => {
//   return (
//     <Box>
//       {videos.map((video) => (
//         <Video key={video.title} video={video} />
//       ))}
//     </Box>
//   )
// }

// export default YouTube

// import { Box } from '@mui/material'
// // import { useEffect, useState } from 'react'
// import Video from './Video'
// import videos from './yt'
import { useState } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'

import ResizeHandle from './ResizeHandle'
import styles from './styles.module.css'

export default function App() {
  const [showFirstPanel, setShowFirstPanel] = useState(true)
  const [showLastPanel, setShowLastPanel] = useState(true)

  return (
    <div className={styles.Container}>
      <div className={styles.TopRow}>
        <a
          className={styles.Link}
          href='https://github.com/bvaughn/react-resizable-panels'
        >
          github.com/bvaughn/react-resizable-panels
        </a>

        <p>
          <button
            className={styles.Button}
            onClick={() => setShowFirstPanel(!showFirstPanel)}
          >
            {showFirstPanel ? 'hide' : 'show'} top panel
          </button>
          &nbsp;
          <button
            className={styles.Button}
            onClick={() => setShowLastPanel(!showLastPanel)}
          >
            {showLastPanel ? 'hide' : 'show'} bottom panel
          </button>
        </p>
      </div>
      <div className={styles.BottomRow}>
        <PanelGroup autoSaveId='example' direction='horizontal'>
          {showFirstPanel && (
            <>
              <Panel
                className={styles.Panel}
                collapsible={true}
                defaultSize={20}
                order={1}
              >
                <div className={styles.PanelContent}>top</div>
              </Panel>
              <ResizeHandle />
            </>
          )}
          <Panel className={styles.Panel} collapsible={true} order={2}>
            <div className={styles.PanelContent}>middle</div>
          </Panel>
          {showLastPanel && (
            <>
              <ResizeHandle />
              <Panel
                className={styles.Panel}
                collapsible={true}
                defaultSize={20}
                order={3}
              >
                <div className={styles.PanelContent}>bottom</div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  )
}
