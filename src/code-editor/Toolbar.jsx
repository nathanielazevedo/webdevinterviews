/* eslint-disable react/prop-types */
import Timer from './Timer'
import ToolbarMenu from './ToolbarMenu'
import ToolbarIcons from './ToolbarIcons'

const Toolbar = ({ codemirrorInstance }) => {
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

      <div style={{ flex: 1 }}></div>
      <Timer />
    </div>
  )
}

export default Toolbar
