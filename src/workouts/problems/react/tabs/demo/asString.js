export default {"/App.js":{"code":"import { useState } from 'react'\nimport Panel from './Panel'\n\nexport default function App() {\n  const [currTab, setCurrTab] = useState(0)\n\n  return (\n    <div className='container'>\n      <div className='tabs-container'>\n        {['TAB 1', 'TAB 2', 'TAB 3'].map((tab, index) => (\n          <div\n            key={tab}\n            className='tab'\n            onClick={() => setCurrTab(index)}\n            style={{\n              borderBottom:\n                index == currTab ? 'blue 2px solid' : 'black 1px solid',\n            }}\n          >\n            <b\n              style={{\n                color: index == currTab ? 'blue' : 'black',\n              }}\n            >\n              {tab}\n            </b>\n          </div>\n        ))}\n      </div>\n\n      <Panel currTab={currTab} index={0}>\n        Panel One\n      </Panel>\n      <Panel currTab={currTab} index={1}>\n        Panel Two\n      </Panel>\n      <Panel currTab={currTab} index={2}>\n        Panel Three\n      </Panel>\n    </div>\n  )\n}\n"},"/Panel.js":{"code":"/* eslint-disable react/prop-types */\n\nconst Panel = ({ children, currTab, index }) => {\n  return (\n    <div hidden={currTab !== index}>\n      {currTab === index && <div>{children}</div>}\n    </div>\n  )\n}\n\nexport default Panel\n"},"/styles.css":{"code":".container {\n  height: 200px;\n}\n\n.tabs-container {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n}\n\n.tab {\n  border-bottom: solid black 1px;\n  padding: 5px 20px;\n  cursor: pointer;\n}\n"}};