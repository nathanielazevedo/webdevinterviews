/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Box, Tooltip } from '@mui/material'
import { useSandpack, useActiveCode } from '@codesandbox/sandpack-react'
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
// import * from 'stylelint-prettier'
import parserPostcss from 'prettier/parser-postcss'
import PrettierSvg from '../../assets/prettier.svg'

const Prettier = ({ codemirrorInstance }) => {
  const [prettierCode, setPrettierCode] = useState('')
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()
  const runPrettier = () => {
    if (activeCode.code) {
      console.log('activeCode', sandpack)
      try {
        const formatted = prettier.format(activeCode.code, {
          parser: true ? 'css' : 'babel',
          plugins: true ? [parserPostcss] : [parserBabel],
        })

        setPrettierCode(formatted)
      } catch (err) {
        console.error('Prettier failed to format the code', err)
      }
    }
  }

  useEffect(() => {
    try {
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
    } catch (err) {
      console.error('Prettier failed to format the code')
    }
  }, [prettierCode])
  return (
    <Tooltip
      title='Format'
      onClick={() => runPrettier()}
      placement='left'
      sx={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: '100',
        color: 'primary.main',
        height: '20px',
        width: '20px',
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <Box>
        <img src={PrettierSvg} alt='prettier' width='20px' />
      </Box>
    </Tooltip>
  )
}

export default Prettier
