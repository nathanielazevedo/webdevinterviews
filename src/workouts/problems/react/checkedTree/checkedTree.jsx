import asString from './demo/asString'
import template from './template/asString'
import gif from './checkedTree.gif'

const checkedTree = {
  id: 2,
  name: 'checkedTree',
  title: 'Checked Tree',
  difficulty: 3,
  gist: 'A nested checkbox tree.',
  description:
    'In data.js you will find the data that the backend is returning to you. The data is coming in flat. Your job is to render the data in a tree like structure and add functionality to it. This component needs to work in a form, therefore the base code you are provided with is a form in which your component should live.',
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
  demo: asString,
  template: template,
  type: 'react',
}

export default checkedTree
