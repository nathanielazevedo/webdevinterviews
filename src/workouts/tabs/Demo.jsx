/* eslint-disable react/prop-types */
import EditorMain from '../../code-editor/EditorMain'

const Demo = ({ challenge }) => {
  const files = challenge.demo
  return <EditorMain files={files} setFiles={() => {}} challenge={challenge} />
}

export default Demo
