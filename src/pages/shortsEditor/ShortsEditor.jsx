import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'
import React from 'react'
import { PanelGroup, Panel } from 'react-resizable-panels'
import ResizeHandle from '../../components/ResizeHandle'

const ShortsEditor = () => {
  return (
    <div className='fit-wrapper'>
      <div style={{ height: '700px' }}>
        <SandpackProvider
          options={{ autoReload: false }}
          template='react'
          files={{ 'index.js': 'console.log("hello world")' }}
        >
          <SandpackThemeProvider theme={'dark'}>
            <SandpackLayout className='shorts-layout'>
              <PanelGroup direction='vertical'>
                <Panel>
                  <div style={{ height: '400px' }}>
                    <SandpackCodeEditor className='shorts-editor' showTabs />
                  </div>
                </Panel>
                <ResizeHandle horz={true} />
                <Panel>
                  <div hidden>
                    <SandpackPreview className='shorts' />
                  </div>
                  <SandpackConsole resetOnPreviewRestart />
                </Panel>
              </PanelGroup>
            </SandpackLayout>
          </SandpackThemeProvider>
        </SandpackProvider>
      </div>
    </div>
  )
}

export default ShortsEditor
