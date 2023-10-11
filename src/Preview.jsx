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
          height: showConsole ? '300px' : '90vh',
        }}
      />
      <SandpackConsole showHeader={true} />
    </>
  )
}

export default Preview
