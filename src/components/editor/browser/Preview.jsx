/* eslint-disable react/prop-types */
import { SandpackPreview, SandpackTests } from '@codesandbox/sandpack-react'

const Browser = ({ showTests }) => {
  return showTests ? (
    <SandpackTests style={{ height: '100%' }} />
  ) : (
    <SandpackPreview
      showNavigator
      style={{ height: '100%' }}
      showOpenInCodeSandbox={false}
    />
  )
}

export default Browser
