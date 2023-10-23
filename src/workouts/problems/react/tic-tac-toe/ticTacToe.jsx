import asString from './demo/asString'
import image from './tic-tac-toe.png'

const transferList = {
  id: 1,
  name: 'ticTacToe',
  title: 'Tic Tac Toe',
  difficulty: 4,
  checkList: [
    'Render the data in a nested structure.',
    'Clicking a parent should expand/collapse its children.',
    'Search should filter out matching items.',
    'Checking a child should check all its parents.',
    'Unchecking a parent should uncheck all its children.',
    'Clicking submit should console an array of all the checked items IDs.',
  ],
  gif: image,
  link: 'https://youtu.be/vweARwTPmg4',
  demo: asString,
  template: {},
}

export default transferList
