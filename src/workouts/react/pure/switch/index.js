export default {
  id: 7,
  name: 'switch',
  title: 'Switch',
  difficulty: 1,
  checkList: [
    'Ball should move back and forth.',
    'Status of switch should be in state.',
  ],
  gif: '/src/workouts/react/pure/switch/gif.gif',
  link: 'https://youtu.be/NRFOgIOxRrg',
  solution: {
    '/App.js': {
      code: "import { useState } from 'react'\n\nexport default function App() {\n  const [switchStatus, setSwitchStatus] = useState(0)\n  console.log(switchStatus)\n  return (\n    <div className={`${switchStatus ? 'barOn' : 'barOff'} bar`}>\n      <div\n        className={`${switchStatus ? 'on' : 'off'} ball`}\n        onClick={() => setSwitchStatus(!switchStatus)}\n      ></div>\n    </div>\n  )\n}\n",
    },
    '/styles.css': {
      code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}\n\n.bar {\n  width: 100px;\n  height: 50px;\n\n  border-radius: 20px;\n  background-color: lightblue;\n  position: relative;\n}\n\n.ball {\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n  background-color: blue;\n  position: absolute;\n}\n\n.on {\n  background-color: blue;\n  right: 0;\n}\n\n.off {\n  background-color: grey;\n}\n\n.barOn {\n  background-color: lightblue;\n}\n\n.barOff {\n  background-color: lightgrey;\n}\n',
    },
  },
  template: {
    '/styles.css': {
      code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
    },
    '/App.js': {
      code: 'export default function App() {\n  return <h1>Hello world</h1>\n}\n',
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
  path: '/workouts/react/pure/switch',
}
