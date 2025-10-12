import { useSandpack } from '@codesandbox/sandpack-react'

const PrintCode = () => {
  const { sandpack } = useSandpack()
  console.log(JSON.stringify(sandpack.files['/index.js'].code))
  return null
}

export default PrintCode
