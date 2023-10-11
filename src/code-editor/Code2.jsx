/* eslint-disable react/prop-types */
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
  // SandpackStack,
  SandpackLayout,
  useSandpack,
  useActiveCode,
} from '@codesandbox/sandpack-react'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import { useEffect, useState, useRef } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import Preview from '../Preview'

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
        files={code ? JSON.parse(code) : {}}
        options={{
          visibleFiles: ['/App.js'],
        }}
      >
        <Some challenge={challenge} setCode={setCode} />
        <SandpackThemeProvider theme={'dark'}>
          <SandpackLayout>
            <div
              style={{
                display: 'flex',
                width: '100%',
                minHeight: '95vh',
                maxHeight: '95vh',
                backgroundColor: `var(--sp-colors-surface1)`,
              }}
            >
              <PanelGroup autoSaveId='example' direction='horizontal'>
                <>
                  <Panel collapsible={true} defaultSize={20} order={1}>
                    <SandpackFileExplorer style={{ height: '100%' }} />
                  </Panel>
                  <ResizeHandle />
                </>
                <>
                  <Panel
                    collapsible={true}
                    order={2}
                    style={{
                      overflow: 'scroll',
                    }}
                  >
                    <SandpackCodeEditor
                      ref={codemirrorInstance}
                      wrapContent
                      showTabs
                      closableTabs
                      showInlineErrors
                      showLineNumbers
                    />
                  </Panel>
                </>
                <>
                  <ResizeHandle />
                  <Panel collapsible={true} defaultSize={20} order={3}>
                    <div>
                      <div
                        style={{
                          minWidth: 190,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Preview
                          setCode={setCode}
                          codemirrorInstance={codemirrorInstance}
                        />
                      </div>
                    </div>
                  </Panel>
                </>
              </PanelGroup>
            </div>
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  )
}

export default MySandpackComponent
