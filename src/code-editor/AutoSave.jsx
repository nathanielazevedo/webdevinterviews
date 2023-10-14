/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useSandpack, useActiveCode } from '@codesandbox/sandpack-react'

const AutoSave = ({ challenge, setCode, demo, autoSave }) => {
  const { sandpack } = useSandpack()
  const { files } = sandpack
  const activeCode = useActiveCode()

  useEffect(() => {
    if (!autoSave) return
    const newData = {}
    const keys = Object.keys(files)
    const tag = demo ? 'demo' : 'challenge'
    keys.forEach((each) => {
      newData[each] = files[each].code
    })
    localStorage.setItem(challenge.id + tag, JSON.stringify(newData))
  }, [activeCode.code, autoSave, challenge.id, demo, files, setCode])

  return <></>
}

export default AutoSave
