/* eslint-disable react/prop-types */
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import { useEffect, useState, useCallback } from 'react'
import { useSandpack, useActiveCode } from '@codesandbox/sandpack-react'

const Prettier = ({ codemirrorInstance }) => {
  const [prettierCode, setPrettierCode] = useState('')
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()

  // eslint-disable-next-line no-unused-vars
  const runPrettier = useCallback(() => {
    if (activeCode.code) {
      try {
        /**
         * I would recomend to run this process in a Worker
         */
        const formatted = prettier.format(activeCode.code, {
          parser: 'babel',
          plugins: [parserBabel],
        })

        setPrettierCode(formatted)
      } catch (e) {
        console.log(e)
      }
    }
  }, [activeCode.code])

  useEffect(() => {
    if (prettierCode) {
      const cmInstance = codemirrorInstance.current.getCodemirror()

      if (cmInstance) {
        try {
          const trans = cmInstance.state.update({
            selection: cmInstance.state.selection,
            changes: {
              from: 0,
              to: cmInstance.state.doc.length,
              insert: prettierCode,
            },
          })
          cmInstance.update([trans])
        } catch {
          console.log('error prettying')
        }
      }

      sandpack.updateFile(sandpack.activePath, prettierCode)

      setPrettierCode(null)
    }
  }, [prettierCode])

  return null
}

export default Prettier
