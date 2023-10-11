/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useSandpack, useActiveCode } from '@codesandbox/sandpack-react'

const LocalStorage = ({ challenge, setCode }) => {
  const { sandpack } = useSandpack()
  const { files } = sandpack
  const activeCode = useActiveCode()

  useEffect(() => {
    const newData = {}
    const keys = Object.keys(files)
    keys.forEach((each) => {
      newData[each] = files[each].code
    })
    localStorage.setItem(challenge.id, JSON.stringify(newData))
  }, [activeCode.code, challenge.id, files, setCode])

  return <></>
}

export default LocalStorage
