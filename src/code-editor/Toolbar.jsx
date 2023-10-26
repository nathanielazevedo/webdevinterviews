/* eslint-disable react/prop-types */
import Timer from './Timer'
import { useState } from 'react'
import Alert from '../components/Alert'
import ToolbarMenu from './ToolbarMenu'
import ToolbarIcons from './ToolbarIcons'
import { ToolbarIcon } from './ToolbarIcons'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'

const Toolbar = ({ codemirrorInstance }) => {
  const [showWarning, setShowWarning] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        height: '35px',
        display: 'flex',
        padding: '0 10px',
        alignItems: 'center',
        backgroundColor: '#171717',
        borderBottom: '0.5px solid var(--color-solid-resize-bar)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ToolbarMenu codemirrorInstance={codemirrorInstance} />

        <div className='bar-divider' />

        <ToolbarIcons codemirrorInstance={codemirrorInstance} />
      </div>

      <div className='bar-divider' />
      <Timer />
      <div style={{ flex: 1 }}></div>

      <ToolbarIcon
        icon={{
          title: 'Reset Code',
          content: <RotateLeftOutlinedIcon color='error' />,
          onClick: () => setShowWarning(true),
        }}
      />

      {showWarning && <Alert setOpen={setShowWarning} />}
    </div>
  )
}

export default Toolbar
