/* eslint-disable react/prop-types */
import { SandpackPreview, SandpackTests } from '@codesandbox/sandpack-react'
import PreviewTabs from './PreviewTabs'

const Browser = ({ showTests }) => {
  const dog = 'cat'
  return <PreviewTabs />
}
// const Browser = ({ showTests }) =>
//   showTests ? (
//     <SandpackTests style={{ height: '100%' }} />
//   ) : (
// <SandpackPreview
//   showNavigator
//   style={{ height: '100%' }}
//   showOpenInCodeSandbox={false}
// />
//   )

export default Browser
