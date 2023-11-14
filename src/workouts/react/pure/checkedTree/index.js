import solution from './solution/asString'
import template from './template/asString'
import gif from './checkedTree.gif'

const checkedTree = {
  id: 2,
  name: 'checkedTree',
  title: 'Checked Tree',
  difficulty: 3,
  checkList: [
    'Render the data in a nested structure.',
    'Clicking a parent should expand/collapse its children.',
    'Search should filter out matching items.',
    'Checking a child should check all its parents.',
    'Unchecking a parent should uncheck all its children.',
    'Clicking submit should console an array of all the checked items IDs.',
  ],
  gif: gif,
  link: 'https://www.youtube.com/watch?v=WX8Oplyd3Ag',
  demo: solution,
  template: template,
  type: 'react',
}

export default checkedTree
