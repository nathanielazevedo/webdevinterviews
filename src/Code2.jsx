/* eslint-disable react/prop-types */
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackPreview,
  SandpackCodeEditor,
  // SandpackStack,
  SandpackLayout,
  // SandpackConsole,
  useSandpack,
  useActiveCode,
} from '@codesandbox/sandpack-react'
import PreviewTabs from './PreviewTabs'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import { useEffect, useState, useRef } from 'react'
// import * as prettier from 'prettier'
// import parserBabel from 'prettier/parser-babel'

// const Prettier = ({ codemirrorInstance }) => {
//   const [prettierCode, setPrettierCode] = useState('')
//   const { sandpack } = useSandpack()
//   const activeCode = useActiveCode()

//   const runPrettier = useCallback(() => {
//     if (activeCode.code) {
//       try {
//         /**
//          * I would recomend to run this process in a Worker
//          */
//         const formatted = prettier.format(activeCode.code, {
//           parser: 'babel',
//           plugins: [parserBabel],
//         })

//         setPrettierCode(formatted)
//       } catch (e) {
//         console.log(e)
//       }
//     }
//   }, [activeCode.code])

//   /**
//    * You need to find a proper trigger to run the Prettier,
//    * for example in the VSCode is the save actions, and
//    * I used a debounce on every change.
//    */
//   useEffect(() => {
//     const debounce = setTimeout(runPrettier, 1000)
//     return () => {
//       clearInterval(debounce)
//     }
//   }, [runPrettier])

//   useEffect(() => {
//     if (prettierCode) {
//       const cmInstance = codemirrorInstance.current.getCodemirror()

//       if (cmInstance) {
//         try {
//           const trans = cmInstance.state.update({
//             selection: cmInstance.state.selection,
//             changes: {
//               from: 0,
//               to: cmInstance.state.doc.length,
//               insert: prettierCode,
//             },
//           })
//           cmInstance.update([trans])
//         } catch {
//           console.log('error')
//         }
//       }

//       sandpack.updateFile(sandpack.activePath, prettierCode)

//       setPrettierCode(null)
//     }
//   }, [prettierCode])

//   return null
// }

const Some = ({ challenge, setCode }) => {
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

const MySandpackComponent = ({ challenge }) => {
  const [code, setCode] = useState(
    localStorage.getItem(challenge.id) ?? undefined
  )
  const codemirrorInstance = useRef()

  return (
    <>
      <SandpackProvider
        template='react'
        options={{ showConsole: true }}
        files={code ? JSON.parse(code) : {}}
      >
        <Some challenge={challenge} setCode={setCode} />
        <SandpackThemeProvider theme={'auto'}>
          <SandpackLayout>
            <div
              style={{
                display: 'flex',
                width: '100%',
                minHeight: '700px',
                maxHeight: '700px',
                backgroundColor: `var(--sp-colors-surface1)`,
              }}
            >
              <div
                style={{
                  minWidth: 190,
                  maxWidth: '300px',
                  overflow: 'hidden',
                }}
              >
                <PreviewTabs />
                <SandpackPreview
                  style={{
                    height: '950%',
                  }}
                />
              </div>

              <SandpackCodeEditor
                ref={codemirrorInstance}
                wrapContent
                style={{
                  minHeight: '100%',
                  maxHeight: '100%',
                  overflow: 'auto',
                  maxWidth: '55%',
                }}
                showTabs
                closableTabs
                showInlineErrors
                showLineNumbers
                showResetButton
              />
              {/* <Prettier codemirrorInstance={codemirrorInstance} /> */}
              <div
                style={{
                  minWidth: 190,
                  maxWidth: '300px',
                  overflow: 'hidden',
                }}
              >
                <SandpackFileExplorer />
              </div>
            </div>
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  )
}

export default MySandpackComponent
