/* eslint-disable react/prop-types */
import Timer from './Timer'
import ToolbarIcons from './ToolbarIcons'
import TopNav from '../../components/frame/TopNav'

const Toolbar = ({ codemirrorInstance }) => {
  return (
    <TopNav
      actions={
        <>
          <div className='bar-divider' />
          <ToolbarIcons codemirrorInstance={codemirrorInstance} />
          <div style={{ flex: 1 }}></div>
          <Timer />
        </>
      }
    />
  )
}

export default Toolbar
