import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackStack,
  SandpackLayout,
  SandpackConsole,
} from '@codesandbox/sandpack-react'

import { SandpackFileExplorer } from 'sandpack-file-explorer'

const MySandpackComponent = () => {
  return (
    <SandpackProvider template='react'>
      <SandpackThemeProvider
        theme={{
          colors: {
            surface1: '#151515',
            surface2: '#252525',
            surface3: '#2F2F2F',
            clickable: '#999999',
            base: '#808080',
            disabled: '#4D4D4D',
            hover: '#C5C5C5',
            accent: '#19e4ff',
            error: '#a33aff',
            errorSurface: '#f6ebff',
          },
          syntax: {
            plain: '#FFFFFF',
            comment: {
              color: '#757575',
              fontStyle: 'italic',
            },
            keyword: '#19e4ff',
            tag: '#4ffd4f',
            punctuation: '#ffffff',
            definition: '#a3f4ff',
            property: '#19e4ff',
            static: '#a33aff',
            string: '#03fc03',
          },
          font: {
            body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
            size: '13px',
            lineHeight: '20px',
          },
        }}
      >
        <SandpackStack>
          <SandpackLayout>
            <div
              style={{
                display: 'flex',
                width: '100%',
                minHeight: '300px',
                maxHeight: '300px',
                backgroundColor: `var(--sp-colors-surface1)`,
              }}
            >
              <div
                style={{
                  minWidth: 150,
                  maxWidth: '300px',
                  overflow: 'hidden',
                }}
              >
                <SandpackFileExplorer />
              </div>
              <div style={{ flex: 'min-content' }}>
                <SandpackCodeEditor
                  wrapContent
                  style={{
                    minHeight: '100%',
                    maxHeight: '100%',
                    overflow: 'auto',
                  }}
                  showTabs
                  closableTabs
                  showInlineErrors
                  showLineNumbers
                />
              </div>
            </div>
            <SandpackPreview showNavigator />
            <SandpackConsole showHeader={false} />
          </SandpackLayout>
        </SandpackStack>
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

export default MySandpackComponent
