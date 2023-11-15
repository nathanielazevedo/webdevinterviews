export default {
  id: 5,
  name: 'tabs',
  title: 'Tabs',
  difficulty: 1,
  checkList: [
    'Build 3 clickable tabs',
    'Clicking on tab should show proper contents for that tab.',
  ],
  gif: '/src/workouts/react/pure/tabs/tabs-gif.gif',
  link: 'https://youtu.be/kjsPAe5boEU',
  solution: {
    '/App.js': {
      code: "const tabs = ['TAB 1', 'TAB 2', 'TAB 3']\nconst panels = ['Panel 1', 'Panel 2', 'Panel 3']\nimport { useState } from 'react'\nimport Tab from './Tab'\nimport Panel from './Panel'\n\nexport default function App() {\n  const [currTab, setCurrTab] = useState(0)\n\n  const handleTabChange = (tab) => {\n    setCurrTab(tab)\n  }\n\n  return (\n    <div>\n      <div className='tabs-container'>\n        {tabs.map((tab, index) => {\n          return (\n            <Tab\n              key={index}\n              tab={tab}\n              onClick={() => handleTabChange(index)}\n              active={currTab === index}\n            />\n          )\n        })}\n      </div>\n      <div style={{ paddingTop: '15px' }}>\n        {panels.map((panel, index) => {\n          return <Panel key={index} tab={currTab} index={index} panel={panel} />\n        })}\n      </div>\n    </div>\n  )\n}\n",
    },
    '/styles.css': {
      code: '.tabs-container {\n  display: flex;\n  gap: 10px;\n}\n\n.tab {\n  border-bottom: 1px solid black;\n  padding-bottom: 5px;\n  cursor: pointer;\n}\n',
    },
    '/Panel.js': {
      code: '/* eslint-disable react/prop-types */\n// Panel.js\n\nconst Panel = ({ panel, tab, index }) => {\n  return <div hidden={tab === index ? false : true}>{panel}</div>\n}\n\nexport default Panel\n',
    },
    '/Tab.js': {
      code: "/* eslint-disable react/prop-types */\n// Tab.js\n\nconst Tab = ({ tab, onClick, active }) => {\n  return (\n    <div\n      className='tab'\n      onClick={onClick}\n      style={{\n        borderBottom: active ? '2px solid blue' : '1px solid black',\n      }}\n    >\n      <b\n        style={{\n          color: active ? 'blue' : 'black',\n        }}\n      >\n        {tab}\n      </b>\n    </div>\n  )\n}\n\nexport default Tab\n",
    },
  },
  template: {
    '/styles.css': {
      code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
    },
    '/App.js': {
      code: "const tabs = ['TAB 1', 'TAB 2', 'TAB 3']\nconst panels = ['Panel 1', 'Panel 2', 'Panel 3']\n\nexport default function App() {\n  return <h1>Hello world</h1>\n}\n",
    },
    '/index.js': {
      code: 'import React, { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "./styles.css";\n\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);',
    },
    '/public/index.html': {
      code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
    },
    '/package.json': {
      code: '{\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "react-scripts": "^5.0.0",\n    "jest-extended": "^3.0.2",\n    "react-router-dom": "^6.16.0"\n  },\n  "main": "/index.js",\n  "devDependencies": {}\n}',
    },
  },
  type: 'react',
  path: '/workouts/react/pure/tabs',
}
