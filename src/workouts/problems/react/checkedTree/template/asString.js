export default {
  '/App.js':
    "import './styles.css'\nimport data from './data'\nimport { useState } from 'react'\n// import CheckedTree from './CheckedTree'\n\nconst Main = () => {\n  const [formData, setFormData] = useState({ checkedTree: [] })\n\n  const handleSubmit = () => {\n    console.log(formData)\n  }\n\n  return (\n    <div className='container'>\n      <h1>Mock Form</h1>\n      <input placeholder='Mock Input' className='common' />\n      <input placeholder='Mock Input' className='common' />\n      {/* <CheckedTree /> */}\n      <button onClick={handleSubmit} className='common'>\n        Submit\n      </button>\n    </div>\n  )\n}\n\nexport default Main\n",
  '/data.js':
    "const response = [\n  { id: 4, parentId: 3, name: 'Days' },\n  { id: 1, parentId: null, name: 'Years' },\n  { id: 2, parentId: 1, name: 'Months' },\n  { id: 5, parentId: null, name: 'Stars' },\n  { id: 3, parentId: 2, name: 'Weeks' },\n  { id: 6, parentId: 5, name: 'Sun' },\n  { id: 7, parentId: 5, name: 'Proxima Centauri' },\n  { id: 8, parentId: null, name: 'Dogs' },\n]\n\nexport default response\n",
  '/styles.css':
    '* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.container {\n  margin: 30px;\n  width: 500px;\n  color: black;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.common {\n  width: 100%;\n  padding: 10px;\n}\n',
}
