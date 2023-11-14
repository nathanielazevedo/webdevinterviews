/* eslint-disable no-unused-vars */
import { useState } from 'react'

const generateBoard = (size) => {
  const newBoard = []
  for (let i = 0; i < size; i++) {
    newBoard.push([...Array(size)])
  }
  return newBoard
}

const checkHorizotal = (board) => {
  for (let row of board) {
    const rowSet = new Set(row)
    if (rowSet.size == 1 && !rowSet.has(undefined)) {
      return true
    }
  }
}

const rowsToColums = (board) => {
  const newBoard = []
  let column = 0
  while (column < board.length) {
    const newRow = []
    for (let row = 0; row < board.length; row++) {
      newRow.push(board[row][column])
    }
    newBoard.push(newRow)
    column++
  }
  return newBoard
}

const diagnolToRow = (board) => {
  const newBoard = [[], []]
  let increment = 0
  let decrement = board.length - 1
  while (increment < board.length) {
    newBoard[0].push(board[increment][increment])
    newBoard[1].push(board[increment][decrement])
    increment++
    decrement++
  }
  return newBoard
}

const checkForWin = (board) => {
  // horizontal
  if (checkHorizotal(board)) {
    return true
  }
  // vertical
  if (checkHorizotal(rowsToColums(board))) {
    return true
  }
  // diagnol
  if (checkHorizotal(diagnolToRow(board))) {
    return true
  }
}

function Tictactoe() {
  const [board, setBoard] = useState(generateBoard(3))
  const [currPlayer, setCurrPlayer] = useState('x')

  const handleClick = (row, col) => {
    board[row][col] = currPlayer
    setBoard([...board])
    if (checkForWin(board)) {
      console.log(currPlayer + 'wins')
      setBoard(generateBoard(3))
      setCurrPlayer('x')
    } else {
      setCurrPlayer(currPlayer == 'x' ? 'y' : 'x')
    }
  }
  return (
    <div>
      {board.map((row, r) => {
        return (
          <div
            key={r}
            style={{
              display: 'flex',
            }}
          >
            {row.map((cell, c) => {
              return (
                <div
                  key={c}
                  onClick={() => handleClick(r, c)}
                  style={{
                    border: 'solid black 1px',
                    height: '50px',
                    width: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {cell}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Tictactoe
