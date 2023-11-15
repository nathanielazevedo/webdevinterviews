export default {
  id: 6,
  name: 'swapOdds',
  title: 'Swap Odds',
  difficulty: 2,
  gist: 'A nested checkbox tree.',
  description: '',
  checkList: [
    'Render both lists to the screen.',
    'Render a button to the screen.',
    'When the button is clicked, swap the odds from the left list to the right list and vice versa.',
  ],
  gif: '/src/workouts/react/pure/swap-odds/swapOddsGif.gif',
  link: 'https://youtu.be/TNoC0Ri52VU',
  solution: {
    '/Item.js': {
      code: "/* eslint-disable react/prop-types */\nconst Item = ({ item, index }) => {\n  return (\n    <li className='item'>\n      <small className='item-number'>{index + 1}.</small>\n      {item.charAt(0).toUpperCase() + item.slice(1)}\n    </li>\n  )\n}\n\nexport default Item\n",
    },
    '/App.js': {
      code: "import Cart from './Cart'\nimport { useState } from 'react'\nimport { cart1, cart2 } from './data.js'\n\nconst SwapOdds = () => {\n  const [cartA, setCartA] = useState(cart1)\n  const [cartB, setCartB] = useState(cart2)\n\n  const swapOdds = () => {\n    const newCartA = [...cartA]\n    const newCartB = [...cartB]\n    for (let i = 0; i < newCartA.length; i += 2) {\n      const temp = newCartA[i]\n      newCartA[i] = newCartB[i]\n      newCartB[i] = temp\n    }\n    setCartA(newCartA)\n    setCartB(newCartB)\n  }\n\n  return (\n    <div className='page flex'>\n      <div className='container flex'>\n        <Cart cartNumber={1} data={cartA} />\n        <button onClick={swapOdds} className='swap-button'>\n          Swap Odds\n        </button>\n        <Cart cartNumber={2} data={cartB} />\n      </div>\n    </div>\n  )\n}\n\nexport default SwapOdds\n",
    },
    '/Cart.js': {
      code: "/* eslint-disable react/prop-types */\nimport Item from './Item'\n\nconst Cart = ({ data, cartNumber }) => {\n  return (\n    <div className='cart'>\n      <h2 className='cart-title'>Cart {cartNumber}</h2>\n      <ul>\n        {data.map((item, index) => (\n          <Item key={index} item={item} index={index} />\n        ))}\n      </ul>\n    </div>\n  )\n}\n\nexport default Cart\n",
    },
    '/data.js': {
      code: "const cart1 = ['apples', 'bananas', 'grapes', 'oranges', 'pears', 'pineapple']\nconst cart2 = ['potatoes', 'beans', 'carrots', 'spinnach', 'kale', 'broccoli']\n\nexport { cart1, cart2 }\n",
    },
    '/styles.css': {
      code: '* {\n  padding: 0;\n  margin: 0;\n}\n\n.flex {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.page {\n  height: 100vh;\n}\n\n.container {\n  gap: 20px;\n}\n\n.cart {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  align-items: flex-start;\n  border-radius: 10px;\n  padding: 30px 50px;\n  border: 1px solid black;\n}\n\n.cart-title {\n  border-bottom: 1px solid black;\n}\n\n.item {\n  list-style: none;\n  padding: 5px;\n}\n\n.item-number {\n  margin-right: 4px;\n}\n\n.swap-button {\n  padding: 10px;\n}\n',
    },
  },
  template: {
    '/styles.css': {
      code: '* {\n  padding: 0;\n  margin: 0;\n}\n\n.flex {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.page {\n  height: 100vh;\n}\n',
    },
    '/App.js': {
      code: "import { useState } from 'react'\nimport { cart1, cart2 } from './data.js'\n\nconst App = () => {\n  return <div className='page flex'>Hello Friend</div>\n}\n\nexport default App\n",
    },
    '/index.js': {
      code: 'import React, { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "./styles.css";\n\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);',
    },
    '/public/index.html': {
      code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
    },
    '/package.json': {
      code: '{\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "react-scripts": "^5.0.0",\n    "jest-extended": "^3.0.2",\n    "react-router-dom": "^6.16.0"\n  },\n  "main": "/index.js",\n  "devDependencies": {}\n}',
    },
    '/data.js': {
      code: "const cart1 = ['apples', 'bananas', 'grapes', 'oranges', 'pears', 'pineapple']\nconst cart2 = ['potatoes', 'beans', 'carrots', 'spinnach', 'kale', 'broccoli']\n\nexport { cart1, cart2 }\n",
    },
  },
  type: 'react',
  path: '/workouts/react/pure/swap-odds',
}
