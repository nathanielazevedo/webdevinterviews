import asString from './demo/asString'
import image from './transferList.png'

const transferList = {
  id: 3,
  name: 'transferList',
  title: 'Transfer List',
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
  link: 'https://youtu.be/w0Kvt65Z2Uk',
  demo: asString,
  template: {},
}

export default transferList
