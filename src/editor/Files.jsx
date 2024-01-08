import React from 'react'
import { useSandpackFiles } from 'sandpack-file-explorer'
import { useSandpack } from '@codesandbox/sandpack-react'

const Files = () => {
  const spFiles = useSandpackFiles()
  const { sandpack } = useSandpack()
  return <div />
}

export default Files
