/* eslint-disable react/prop-types */
import PreviewTabs from './PreviewTabs'
import { useState } from 'react'
import { SandpackPreview, SandpackConsole } from '@codesandbox/sandpack-react'

const Preview = ({ setCode, codemirrorInstance }) => {
  const [showConsole, setShowConsole] = useState(false)
  return (
    <>
      <PreviewTabs
        showConsole={showConsole}
        setShowConsole={setShowConsole}
        setCode={setCode}
        codemirrorInstance={codemirrorInstance}
      />
      <SandpackPreview
        options={{ showConsole: true }}
        style={{
          height: showConsole ? '25vh' : '86vh',
        }}
      />
      <div
        style={{
          height: showConsole ? '61vh' : '86vh',
          overflow: 'auto',
        }}
      >
        <SandpackConsole />
      </div>
    </>
  )
}

export default Preview
