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

export { filterItems, findParent }
