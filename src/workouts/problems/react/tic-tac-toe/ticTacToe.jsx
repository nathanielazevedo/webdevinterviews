import asString from './demo/asString'
import image from './tic-tac-toe.png'

const transferList = {
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
  gif: image,
  link: 'https://youtu.be/vweARwTPmg4',
  demo: asString,
  template: {},
  type: 'react',
}

export default transferList
