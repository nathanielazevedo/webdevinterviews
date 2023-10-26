/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Tooltip } from '@mui/material'
import { useState, useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useActiveCode } from '@codesandbox/sandpack-react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'

import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'

export const ToolbarIcon = ({ icon }) => {
  return (
    <Button
      sx={{ height: '30px', color: '#C5C5C5', minWidth: '30px' }}
      onClick={() => icon.onClick()}
    >
      <Tooltip title={icon.title} style={{ cursor: 'pointer' }}>
        {icon.content}
      </Tooltip>
    </Button>
  )
}

const ToolbarIcons = ({ codemirrorInstance }) => {
  const [prettierCode, setPrettierCode] = useState('')
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()

  const runPrettier = () => {
    if (activeCode.code) {
      try {
        const formatted = prettier.format(activeCode.code, {
          parser: 'babel',
          plugins: [parserBabel],
        })

        setPrettierCode(formatted)
      } catch {
        console.error('Prettier failed to format the code')
      }
    }
  }

  useEffect(() => {
    if (prettierCode) {
      const cmInstance = codemirrorInstance.current.getCodemirror()

      if (cmInstance) {
        const trans = cmInstance.state.update({
          selection: cmInstance.state.selection,
          changes: {
            from: 0,
            to: cmInstance.state.doc.length,
            insert: prettierCode,
          },
        })

        cmInstance.update([trans])
      }

      sandpack.updateFile(sandpack.activeFile, prettierCode)

      setPrettierCode(null)
    }
  }, [prettierCode])

  const icons2 = [
    {
      title: 'Format Code',
      content: <AutoAwesomeIcon fontSize='small' />,
      onClick: runPrettier,
    },
    {
      title: 'Run Code',
      content: <DirectionsRunIcon fontSize='small' />,
      onClick: () => sandpack.runSandpack(),
    },
  ]

  return (
    <>
      {icons2.map((icon) => {
        return <ToolbarIcon key={icon.title} icon={icon} />
      })}
    </>
  )
}

export default ToolbarIcons
