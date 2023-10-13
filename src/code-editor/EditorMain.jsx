/* eslint-disable react/prop-types */
import './styles.css'
import { useRef, useState } from 'react'
import Preview from './Preview'
import Toolbar from './Toolbar'
import LocalStorage from './LocalStorage'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
  SandpackLayout,
} from '@codesandbox/sandpack-react'

const EditorMain = ({ demo, files, setFiles, challenge }) => {
  const codemirrorInstance = useRef()
  const [autoSave, setAutoSave] = useState(
    localStorage.getItem('autoSave') === 'true' ? true : false
  )

  const colors = {
    lightBlue: '#9cdcfe',
    yellow: '#dcdcaa',
    purple: '#d16dce',
    green: '#4ec9b0',
    orange: '#ce9178',
    comment: '#6a9956',
    blue: '#569cd6',
  }

  return (
    <div
      style={{
        height: '95vh',
        width: '100%',
        borderRadius: '5px',
        overflow: 'hidden',
        border: '2px solid #2F2F2F',
      }}
    >
      <SandpackProvider
        template='react'
        files={files}
        options={{
          visibleFiles: ['/App.js'],
          autorun: autoSave,
          autoReload: autoSave,
        }}
      >
        {!demo && autoSave && (
          <LocalStorage challenge={challenge} setCode={setFiles} />
        )}
        <SandpackThemeProvider
          theme={{
            colors: {
              surface1: '#1e1e1e',
              surface2: '#181818',
              surface3: '#2F2F2F',
              clickable: '#999999',
              base: '#1e1e1e',
              disabled: '#4D4D4D',
              hover: '#C5C5C5',
              accent: colors.yellow,
              error: 'white',
              errorSurface: '#5c0600',
            },
            syntax: {
              plain: '#C5C5C5',
              comment: {
                color: colors.comment,
                fontStyle: 'italic',
              },
              keyword: colors.purple,
              tag: colors.blue,
              punctuation: 'grey',
              definition: colors.green,
              property: colors.lightBlue,
              static: colors.blue,
              string: colors.orange,
            },
            font: {
              body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              mono: ' "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
              size: '15px',
              lineHeight: '20px',
            },
          }}
        >
          <Toolbar
            setCode={setFiles}
            codemirrorInstance={codemirrorInstance}
            challenge={challenge}
            demo={demo}
            autoSave={autoSave}
            setAutoSave={setAutoSave}
          />
          <SandpackLayout style={{ borderRadius: '0px 0px 5px 5px' }}>
            <div className='layout'>
              <PanelGroup
                autoSaveId='editor-prefs'
                direction='horizontal'
                disablePointerEventsDuringResize
              >
                <>
                  <Panel
                    collapsible={true}
                    defaultSize={demo ? 10 : 20}
                    order={1}
                    minSize={0}
                  >
                    <div
                      style={{
                        height: '100%',
                        overflow: 'auto',
                      }}
                    >
                      <SandpackFileExplorer
                        className='file-explorer'
                        style={{
                          height: '100%',
                          overflow: 'auto',
                        }}
                      />
                    </div>
                  </Panel>
                  <ResizeHandle className='left' />
                </>
                <>
                  <Panel order={2} collapsible={true} minSize={0}>
                    <SandpackCodeEditor
                      ref={codemirrorInstance}
                      wrapContent
                      showTabs
                      closableTabs
                      showInlineErrors
                      showLineNumbers
                      // showRunButton={false}
                      style={{ height: '95%' }}
                    />
                  </Panel>
                </>
                <>
                  <ResizeHandle className='right' />
                  <Panel
                    collapsible={true}
                    defaultSize={50}
                    order={3}
                    minSize={0}
                  >
                    <Preview
                      demo={demo}
                      setCode={setFiles}
                      challenge={challenge}
                      codemirrorInstance={codemirrorInstance}
                    />
                  </Panel>
                </>
              </PanelGroup>
            </div>
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </div>
  )

  // return (
  //   <div
  //     style={{
  //       height: '95vh',
  //       width: '100%',
  //       borderRadius: '5px',
  //       overflow: 'hidden',
  //       border: '2px solid #2F2F2F',
  //     }}
  //   >
  //     <SandpackProvider
  //       template='react'
  //       files={files}
  //       options={{
  //         visibleFiles: ['/App.js'],
  //         autorun: autoSave,
  //         autoReload: autoSave,
  //       }}
  //     >
  //       {/* {!demo && autoSave && (
  //         <LocalStorage challenge={challenge} setCode={setFiles} />
  //       )} */}
  //       <SandpackThemeProvider
  //         theme={{
  //           colors: {
  //             surface1: '#1e1e1e',
  //             surface2: '#181818',
  //             surface3: '#2F2F2F',
  //             clickable: '#999999',
  //             base: '#1e1e1e',
  //             disabled: '#4D4D4D',
  //             hover: '#C5C5C5',
  //             accent: colors.yellow,
  //             error: 'white',
  //             errorSurface: '#5c0600',
  //           },
  //           syntax: {
  //             plain: colors.yellow,
  //             comment: {
  //               color: colors.comment,
  //               fontStyle: 'italic',
  //             },
  //             keyword: colors.purple,
  //             tag: colors.blue,
  //             punctuation: 'grey',
  //             definition: colors.green,
  //             property: colors.lightBlue,
  //             static: colors.blue,
  //             string: colors.orange,
  //           },
  //           font: {
  //             body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  //             mono: ' "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
  //             size: '15px',
  //             lineHeight: '20px',
  //           },
  //         }}
  //       >
  //         <Toolbar
  //           setCode={setFiles}
  //           codemirrorInstance={codemirrorInstance}
  //           challenge={challenge}
  //           demo={demo}
  //           autoSave={autoSave}
  //           setAutoSave={setAutoSave}
  //         />
  //         <SandpackLayout style={{ borderRadius: '0px 0px 5px 5px' }}>
  //           <div className='layout'>
  //             <PanelGroup
  //               autoSaveId='editor-prefs'
  //               direction='horizontal'
  //               disablePointerEventsDuringResize
  //             >
  //               <>
  //                 <Panel
  //                   collapsible={true}
  //                   defaultSize={demo ? 10 : 20}
  //                   order={1}
  //                   minSize={0}
  //                 >
  //                   <div
  //                     style={{
  //                       height: '100%',
  //                       overflow: 'auto',
  //                     }}
  //                   >
  //                     <SandpackFileExplorer
  //                       className='file-explorer'
  //                       style={{
  //                         height: '100%',
  //                         overflow: 'auto',
  //                       }}
  //                     />
  //                   </div>
  //                 </Panel>
  //                 <ResizeHandle className='left' />
  //               </>
  //               <>
  //                 <Panel order={2} collapsible={true} minSize={0}>
  //                   <SandpackCodeEditor
  //                     ref={codemirrorInstance}
  //                     wrapContent
  //                     showTabs
  //                     closableTabs
  //                     showInlineErrors
  //                     showLineNumbers
  //                     // showRunButton={true}
  //                     style={{ height: '95%' }}
  //                   />
  //                 </Panel>
  //               </>
  //               <>
  //                 <ResizeHandle className='right' />
  //                 <Panel
  //                   collapsible={true}
  //                   defaultSize={50}
  //                   order={3}
  //                   minSize={0}
  //                 >
  //                   <Preview
  //                     demo={demo}
  //                     setCode={setFiles}
  //                     challenge={challenge}
  //                     codemirrorInstance={codemirrorInstance}
  //                   />
  //                 </Panel>
  //               </>
  //             </PanelGroup>
  //           </div>
  //         </SandpackLayout>
  //       </SandpackThemeProvider>
  //     </SandpackProvider>
  //   </div>
}

export default EditorMain
