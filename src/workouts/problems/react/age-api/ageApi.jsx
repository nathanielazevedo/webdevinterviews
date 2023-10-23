import asString from './demo/asString'
import image from './ageApi.png'

const ageApi = {
  id: 4,
  name: 'ageApi',
  title: 'Age API',
  difficulty: 2,
  checkList: [
    'Render the data in a nested structure.',
    'Clicking a parent should expand/collapse its children.',
    'Search should filter out matching items.',
    'Checking a child should check all its parents.',
    'Unchecking a parent should uncheck all its children.',
    'Clicking submit should console an array of all the checked items IDs.',
  ],
  gif: image,
  link: 'https://youtu.be/1T0iMtIWmrw',
  demo: asString,
  template: {},
}

export default ageApi
