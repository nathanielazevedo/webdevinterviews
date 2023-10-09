import { useState } from 'react'
import data from './data'
import CheckedTree from './Gpt'

const formatData = (data) => {
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

const Main = () => {
  const [items] = useState(formatData(data))

  return <CheckedTree data={items} />
}

export default Main
