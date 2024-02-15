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
import HorizontalResizeHandle from '../../editor/components/HorizontalResizeHandle'

const ShortsEditor = () => {
  return (
    <div className='layout-main'>
      <div className='SingleColumnSection-root'>
        <div className='shorts-container'>
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
                  <HorizontalResizeHandle />
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
    </div>
  )
}

export default ShortsEditor
