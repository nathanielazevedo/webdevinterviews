/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Box, Tooltip } from '@mui/material'
import { useSandpack, useActiveCode } from '@codesandbox/sandpack-react'
import { parse } from 'angular-html-parser'
import * as prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import parserPostcss from 'prettier/parser-postcss'
import htmlParser from 'prettier/parser-html'
import PrettierSvg from '../../../../assets/prettier.svg'

const Prettier = ({ codemirrorInstance }) => {
  const [prettierCode, setPrettierCode] = useState('')
  const { sandpack } = useSandpack()
  const activeCode = useActiveCode()
  const getFileParserAndPlugin = () => {
    const fileType = sandpack.activeFile.split('.')[1]
    let parser
    let plugin
    if (fileType === 'css') {
      parser = 'css'
      plugin = parserPostcss
    } else if (fileType === 'html') {
      parser = 'html'
      plugin = htmlParser
    } else {
      parser = 'babel'
      plugin = parserBabel
    }
    return { parser, plugin }
  }
  const runPrettier = () => {
    if (activeCode.code) {
      const { parser, plugin } = getFileParserAndPlugin()
      try {
        const formatted = prettier.format(activeCode.code, {
          parser,
          plugins: [plugin],
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
