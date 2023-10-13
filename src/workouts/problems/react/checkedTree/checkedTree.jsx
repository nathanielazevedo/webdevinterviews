import asString from './demo/asString'
import template from './template/asString'
import gif from './checkedTree.gif'

const checkedTree = {
  id: 2,
  name: 'checkedTree',
  title: 'Checked Tree',
  difficulty: 3,
  whatYouWillLearn: ['useContext', 'useRef', 'Recursion'],
  description:
    'In data.js you will find the data that the backend is returning to you. The data is coming in flat. Your job is to render the data in a tree like structure and add functionality to it. This component needs to work in a form, therefore the base code you are provided with is a form in which your component should live.',
  checkList: [
    'Restructure the incoming data.',
    'Render the data in a tree like structure.',
    'Clicking a parent should expand/collapse its children.',
    'Checking a child should check all its parents.',
    'Unchecking a parent should uncheck all its children.',
    'Clicking submit should console an array of all the checked items IDs.',
  ],
  myComments:
    'The checked tree ruined a few days/weeks of my life lol. But it was a great learning experience.',
  gif: gif,
  link: 'https://youtu.be/DhF1SJ5WUlY',
  demo: asString,
  template: template,
}

export default checkedTree
