export default {
  id: 3,
  name: 'transferList',
  title: 'Transfer List',
  difficulty: '3',
  checkList: [
    'Render two lists and action buttons.',
    'Clicking an action button should move the item to the other list.',
  ],
  gif: '/src/workouts/react/pure/transfer-list/transferList.png',
  link: 'https://youtu.be/w0Kvt65Z2Uk',
  solution: {
    '/ActionButtons.js': {
      code: "/* eslint-disable react/prop-types */\nconst ActionButtons = ({ moveRight, moveLeft }) => {\n  return (\n    <div className='buttons flex'>\n      <button onClick={moveRight}>&gt;</button>\n      <button onClick={moveLeft}>&lt;</button>\n    </div>\n  )\n}\n\nexport default ActionButtons\n",
    },
    '/Item.js': {
      code: "/* eslint-disable react/prop-types */\nconst Item = ({ item, handleToggle }) => {\n  return (\n    <label>\n      <input type='checkbox' onChange={handleToggle} />\n      {item}\n    </label>\n  )\n}\n\nexport default Item\n",
    },
    '/App.js': {
      code: "import './styles.css'\nimport List from './List'\nimport { items } from './data'\nimport { useState } from 'react'\nimport ActionButtons from './ActionButtons'\nimport { not, intersection } from './utils'\n\nconst App = () => {\n  const [leftItems, setLeftItems] = useState(items)\n  const [rightItems, setRightItems] = useState([])\n  const [checkedItems, setCheckedItems] = useState([])\n\n  const leftCheckedItems = intersection(checkedItems, leftItems)\n  const rightCheckedItems = intersection(checkedItems, rightItems)\n\n  const handleToggle = (item) => {\n    const currentIndex = checkedItems.indexOf(item)\n    const newChecked = [...checkedItems]\n\n    if (currentIndex === -1) {\n      newChecked.push(item)\n    } else {\n      newChecked.splice(currentIndex, 1)\n    }\n\n    setCheckedItems(newChecked)\n  }\n\n  const moveRight = () => {\n    setRightItems(rightItems.concat(leftCheckedItems))\n    setLeftItems(not(leftItems, leftCheckedItems))\n    setCheckedItems(not(checkedItems, leftCheckedItems))\n  }\n\n  const moveLeft = () => {\n    setLeftItems(leftItems.concat(rightCheckedItems))\n    setRightItems(not(rightItems, rightCheckedItems))\n    setCheckedItems(not(checkedItems, rightCheckedItems))\n  }\n\n  return (\n    <div className='App flex'>\n      <List items={leftItems} handleToggle={handleToggle} />\n      <ActionButtons moveRight={moveRight} moveLeft={moveLeft} />\n      <List items={rightItems} handleToggle={handleToggle} />\n    </div>\n  )\n}\n\nexport default App\n",
    },
    '/data.js': { code: 'export const items = [1, 2, 3, 4]\n' },
    '/styles.css': {
      code: '.flex {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.App {\n  height: 100vh;\n}\n\n.list {\n  border: solid black 1px;\n  width: 100px;\n  height: 150px;\n  flex-direction: column;\n  padding: 20px;\n  gap: 10px;\n  border-radius: 10px;\n}\n\n.buttons {\n  gap: 20px;\n  flex-direction: column;\n  padding: 20px;\n}\n\n.buttons > button {\n  padding: 5px;\n  font-size: 15px;\n  width: 50px;\n}\n',
    },
    '/List.js': {
      code: "/* eslint-disable react/prop-types */\nimport Item from './Item'\n\nconst List = ({ items, handleToggle }) => {\n  return (\n    <div className='list flex'>\n      {items.map((item) => (\n        <Item key={item} item={item} handleToggle={() => handleToggle(item)} />\n      ))}\n    </div>\n  )\n}\n\nexport default List\n",
    },
    '/utils.js': {
      code: 'const intersection = (a, b) => {\n  return a.filter((value) => b.indexOf(value) !== -1)\n}\n\nconst not = (a, b) => {\n  return a.filter((value) => b.indexOf(value) === -1)\n}\n\nexport { not, intersection }\n',
    },
  },
  template: {
    '/styles.css': {
      code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
    },
    '/App.js': {
      code: "export default function App() {\n  console.log('testing editor to solution')\n  return <h1>Hello world</h1>\n}\n",
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
  path: '/workouts/react/pure/transfer-list',
}
