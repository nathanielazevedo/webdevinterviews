/* eslint-disable react/prop-types */
import Timer from './Timer'
import { useState } from 'react'
import Alert from '../components/Alert'
import ToolbarIcons from './ToolbarIcons'
import { ToolbarIcon } from './ToolbarIcons'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import { RenderCounter } from '../components/RenderCount'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'

const Toolbar = ({ codemirrorInstance }) => {
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)

  const leave = () => {
    navigate('/')
  }

  return (
    <div
      style={{
        width: '100%',
        height: '35px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#171717',
        borderBottom: '0.5px solid var(--color-solid-resize-bar)',
      }}
    >
      <RenderCounter name={'Toolbar'} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ToolbarIcon
          icon={{
            title: 'Leave',
            content: <CloseIcon fontSize='small' />,
            onClick: leave,
          }}
        />

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
