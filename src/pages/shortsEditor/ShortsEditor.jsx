import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'
import React from 'react'

const ShortsEditor = () => {
  return (
    <div className='layout-main'>
      <div className='SingleColumnSection-root'>
        <div className='shorts-container'>
          <SandpackProvider
            options={{ autoReload: false }}
            files={{ 'index.js': 'console.log("hello world")' }}
          >
            <SandpackThemeProvider theme={'dark'}>
              <SandpackLayout className='shorts-layout'>
                <SandpackCodeEditor className='shorts-editor' showTabs />
                <SandpackConsole resetOnPreviewRestart />
                <div hidden>
                  <SandpackPreview />
                </div>
              </SandpackLayout>
            </SandpackThemeProvider>
          </SandpackProvider>
        </div>
      </div>
    </div>
  )
}

export default ShortsEditor
