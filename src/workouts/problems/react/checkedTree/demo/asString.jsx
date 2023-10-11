import Gpt from './Gpt'

const asString = {
  '/Gpt.js': <Gpt />,
  '/App.js': `import { useState } from 'react'
import data from './data'
import CheckedTree from './Gpt'
import { formatData } from './utils'

const Main = () => {
  const [items] = useState(formatData(data))
  const [formData, setFormData] = useState({ checkedTree: [] })

  const handleSubmit = () => {
    console.log(formData)
  }

  return (
    <div
      style={{
        border: 'solid white 1px',
        backgroundColor: 'white',
        width: '500px',
        padding: '20px',
      }}
    >
      <h2>Mock Form</h2>
      <CheckedTree
        data={items}
        onChange={(checkedItems) => {
          setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, checkedTree: checkedItems }
            return newFormData
          })
        }}
      />
      <button onClick={handleSubmit} style={{ width: '200px' }}>
        Submit
      </button>
    </div>
  )
}

export default Main`,
  '/index.js': `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  '/utils.js': `const formatData = (data) => {
  const map = {}
  const result = []

  // Create a map of items by their ID for quick access
  data.forEach((item) => {
    item.children = []
    map[item.id] = item
  })

  // Iterate through the items to build the tree
  data.forEach((item) => {
    if (item.parentId !== null) {
      // If the item has a parent, push it into its parent's "children" array
      map[item.parentId].children.push(item)
    } else {
      // If the item has no parent, it's a top-level item, so add it to the result
      result.push(item)
    }
  })
  return result
}

// Recursive function to filter items based on search query, including children
const filterItems = (nodes, query) => {
  return nodes.filter((node) => {
    const isMatch = node.name.toLowerCase().includes(query.toLowerCase())
    if (isMatch) {
      return true
    }
    if (node.children.length > 0) {
      return filterItems(node.children, query).length > 0
    }
    return false
  })
}

const findParent = (nodes, itemId) => {
  for (const node of nodes) {
    if (node.id === itemId) {
      return null // Root node reached
    }
    if (node.children.length > 0) {
      if (node.children.some((child) => child.id === itemId)) {
        return node
      } else {
        const parent = findParent(node.children, itemId)
        if (parent) {
          return parent
        }
      }
    }
  }
  return null
}

export { filterItems, findParent, formatData }`,
}

export default asString
