export default {
  id: 1,
  name: 'ticTacToe',
  title: 'Tic Tac Toe',
  difficulty: 3,
  checkList: [
    'Render a tic-tac-toe board.',
    'Clicking a cell should show player (x, y).',
    'Switch players after each click.',
    'Create win logic',
    'If winner, console winner, restart game.',
  ],
  gif: '/src/workouts/react/pure/tic-tac-toe/tic-tac-toe.png',
  link: 'https://youtu.be/vweARwTPmg4',
  solution: {
    '/App.js': {
      code: "/* eslint-disable no-unused-vars */\nimport { useState } from 'react'\n\nconst generateBoard = (size) => {\n  const newBoard = []\n  for (let i = 0; i < size; i++) {\n    newBoard.push([...Array(size)])\n  }\n  return newBoard\n}\n\nconst checkHorizotal = (board) => {\n  for (let row of board) {\n    const rowSet = new Set(row)\n    if (rowSet.size == 1 && !rowSet.has(undefined)) {\n      return true\n    }\n  }\n}\n\nconst rowsToColums = (board) => {\n  const newBoard = []\n  let column = 0\n  while (column < board.length) {\n    const newRow = []\n    for (let row = 0; row < board.length; row++) {\n      newRow.push(board[row][column])\n    }\n    newBoard.push(newRow)\n    column++\n  }\n  return newBoard\n}\n\nconst diagnolToRow = (board) => {\n  const newBoard = [[], []]\n  let increment = 0\n  let decrement = board.length - 1\n  while (increment < board.length) {\n    newBoard[0].push(board[increment][increment])\n    newBoard[1].push(board[increment][decrement])\n    increment++\n    decrement++\n  }\n  return newBoard\n}\n\nconst checkForWin = (board) => {\n  // horizontal\n  if (checkHorizotal(board)) {\n    return true\n  }\n  // vertical\n  if (checkHorizotal(rowsToColums(board))) {\n    return true\n  }\n  // diagnol\n  if (checkHorizotal(diagnolToRow(board))) {\n    return true\n  }\n}\n\nfunction Tictactoe() {\n  const [board, setBoard] = useState(generateBoard(3))\n  const [currPlayer, setCurrPlayer] = useState('x')\n\n  const handleClick = (row, col) => {\n    board[row][col] = currPlayer\n    setBoard([...board])\n    if (checkForWin(board)) {\n      console.log(currPlayer + 'wins')\n      setBoard(generateBoard(3))\n      setCurrPlayer('x')\n    } else {\n      setCurrPlayer(currPlayer == 'x' ? 'y' : 'x')\n    }\n  }\n  return (\n    <div>\n      {board.map((row, r) => {\n        return (\n          <div\n            key={r}\n            style={{\n              display: 'flex',\n            }}\n          >\n            {row.map((cell, c) => {\n              return (\n                <div\n                  key={c}\n                  onClick={() => handleClick(r, c)}\n                  style={{\n                    border: 'solid black 1px',\n                    height: '50px',\n                    width: '50px',\n                    display: 'flex',\n                    justifyContent: 'center',\n                    alignItems: 'center',\n                  }}\n                >\n                  {cell}\n                </div>\n              )\n            })}\n          </div>\n        )\n      })}\n    </div>\n  )\n}\n\nexport default Tictactoe\n",
    },
    '/asString.js': {
      code: "export default {\"/App.js\":{\"code\":\"/* eslint-disable no-unused-vars */\\nimport { useState } from 'react'\\n\\nconst generateBoard = (size) => {\\n  const newBoard = []\\n  for (let i = 0; i < size; i++) {\\n    newBoard.push([...Array(size)])\\n  }\\n  return newBoard\\n}\\n\\nconst checkHorizotal = (board) => {\\n  for (let row of board) {\\n    const rowSet = new Set(row)\\n    if (rowSet.size == 1 && !rowSet.has(undefined)) {\\n      return true\\n    }\\n  }\\n}\\n\\nconst rowsToColums = (board) => {\\n  const newBoard = []\\n  let column = 0\\n  while (column < board.length) {\\n    const newRow = []\\n    for (let row = 0; row < board.length; row++) {\\n      newRow.push(board[row][column])\\n    }\\n    newBoard.push(newRow)\\n    column++\\n  }\\n  return newBoard\\n}\\n\\nconst diagnolToRow = (board) => {\\n  const newBoard = [[], []]\\n  let increment = 0\\n  let decrement = board.length - 1\\n  while (increment < board.length) {\\n    newBoard[0].push(board[increment][increment])\\n    newBoard[1].push(board[increment][decrement])\\n    increment++\\n    decrement++\\n  }\\n  return newBoard\\n}\\n\\nconst checkForWin = (board) => {\\n  // horizontal\\n  if (checkHorizotal(board)) {\\n    return true\\n  }\\n  // vertical\\n  if (checkHorizotal(rowsToColums(board))) {\\n    return true\\n  }\\n  // diagnol\\n  if (checkHorizotal(diagnolToRow(board))) {\\n    return true\\n  }\\n}\\n\\nfunction Tictactoe() {\\n  const [board, setBoard] = useState(generateBoard(3))\\n  const [currPlayer, setCurrPlayer] = useState('x')\\n\\n  const handleClick = (row, col) => {\\n    board[row][col] = currPlayer\\n    setBoard([...board])\\n    if (checkForWin(board)) {\\n      console.log(currPlayer + 'wins')\\n      setBoard(generateBoard(3))\\n      setCurrPlayer('x')\\n    } else {\\n      setCurrPlayer(currPlayer == 'x' ? 'y' : 'x')\\n    }\\n  }\\n  return (\\n    <div>\\n      {board.map((row, r) => {\\n        return (\\n          <div\\n            key={r}\\n            style={{\\n              display: 'flex',\\n            }}\\n          >\\n            {row.map((cell, c) => {\\n              return (\\n                <div\\n                  key={c}\\n                  onClick={() => handleClick(r, c)}\\n                  style={{\\n                    border: 'solid white 1px',\\n                    height: '50px',\\n                    width: '50px',\\n                    display: 'flex',\\n                    justifyContent: 'center',\\n                    alignItems: 'center',\\n                  }}\\n                >\\n                  {cell}\\n                </div>\\n              )\\n            })}\\n          </div>\\n        )\\n      })}\\n    </div>\\n  )\\n}\\n\\nexport default Tictactoe\\n\"}};",
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
  path: '/workouts/react/pure/tic-tac-toe',
}
