export default {
  id: 4,
  name: 'ageApi',
  title: 'Age API',
  difficulty: 1,
  checkList: [
    'Create a controlled input.',
    'Send a request to the Age API.',
    'Display the response from the Age API.',
    'Create a cache so the same request is not sent twice.',
  ],
  gif: '/src/workouts/react/pure/age-api/ageApi.png',
  link: 'https://youtu.be/1T0iMtIWmrw',
  solution: {
    '/App.js': {
      code: "/* eslint-disable no-prototype-builtins */\nimport './styles.css'\nimport { useState } from 'react'\n\nconst App = () => {\n  const [text, setText] = useState('')\n  const [result, setResult] = useState(null)\n  const [previousSearches, setPreviousSearches] = useState({})\n\n  const handleSubmit = async () => {\n    try {\n      if (previousSearches.hasOwnProperty(text)) {\n        setResult(previousSearches[text])\n      } else {\n        const response = await fetch(`https://api.agify.io/?name=${text}`)\n        if (!response.ok) {\n          throw new Error(response.status)\n        }\n        const result = await response.json()\n        setResult(result.age)\n        setPreviousSearches({ ...previousSearches, [text]: result.age })\n      }\n    } catch (e) {\n      console.log(e)\n    } finally {\n      setText('')\n    }\n  }\n\n  return (\n    <div className='page flex'>\n      <div className='card flex'>\n        <div className='form flex'>\n          <input\n            value={text}\n            placeholder='Enter a Name'\n            onChange={(evt) => setText(evt.target.value)}\n          />\n          <button disabled={text === ''} onClick={handleSubmit}>\n            SUBMIT\n          </button>\n        </div>\n        <h1>{result ?? '-'}</h1>\n      </div>\n    </div>\n  )\n}\n\nexport default App\n",
    },
    '/styles.css': {
      code: '* {\n  box-sizing: border-box;\n}\n\n.flex {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.page {\n  height: 100vh;\n}\n\n.card {\n  border-radius: 10px;\n  border: solid black 1px;\n  padding: 40px;\n  gap: 50px;\n}\n\n.form {\n  gap: 20px;\n  flex-direction: column;\n}\n\n.form > * {\n  padding: 15px;\n  width: 100%;\n}\n',
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
  path: '/workouts/react/pure/age-api',
}
