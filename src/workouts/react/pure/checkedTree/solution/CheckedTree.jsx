/* eslint-disable react/prop-types */
import { useState } from 'react'
import { filterItems } from './utils'

const CheckboxTree = ({ data, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [checkedItems, setCheckedItems] = useState({})
  const [expandedItems, setExpandedItems] = useState({})

  const handleCheckboxChange = (itemId) => {
    const updatedCheckedItems = { ...checkedItems }
    updatedCheckedItems[itemId] = !updatedCheckedItems[itemId]

    if (updatedCheckedItems[itemId]) {
      // If checking a child, check all parents
      checkParents(itemId, updatedCheckedItems)
    } else {
      // If unchecking a parent, uncheck all children
      uncheckAllChildren(data, itemId, updatedCheckedItems)
    }

    // update parent onChange
    const checkedIds = Object.keys(updatedCheckedItems).filter(
      (id) => updatedCheckedItems[id]
    )
    onChange(checkedIds)
    setCheckedItems(updatedCheckedItems)
  }

  const findParent = (nodes, itemId) => {
    for (const node of nodes) {
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

  const checkParents = (id, updatedCheckedItems) => {
    updatedCheckedItems[id] = true
    const parent = findParent(data, id)
    if (parent) {
      checkParents(parent.id, updatedCheckedItems)
    }
  }

  const uncheckAllChildren = (nodes, parentId, updatedCheckedItems) => {
    for (const node of nodes) {
      if (node.id === parentId) {
        // Parent found, uncheck all its children
        uncheckChildren(node, updatedCheckedItems)
        return
      }
      if (node.children.length > 0) {
        uncheckAllChildren(node.children, parentId, updatedCheckedItems)
      }
    }
  }

  const uncheckChildren = (node, updatedCheckedItems) => {
    updatedCheckedItems[node.id] = false
    for (const child of node.children) {
      uncheckChildren(child, updatedCheckedItems)
    }
  }

  const handleExpandToggle = (itemId) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }))
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Filter items based on search query
  const filteredData = filterItems(data, searchQuery)

  const renderTree = (nodes) => {
    return (
      <ul style={{ listStyleType: 'none', paddingInlineStart: '20px' }}>
        {nodes.map((node) => (
          <li key={node.id}>
            <div>
              {node.children.length > 0 ? (
                <span
                  onClick={() => handleExpandToggle(node.id)}
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                >
                  {expandedItems[node.id] ? `v` : '>'}
                </span>
              ) : (
                <span>&nbsp;&nbsp;&nbsp;</span>
              )}
              <label>
                <input
                  type='checkbox'
                  checked={checkedItems[node.id] || false}
                  onChange={() => handleCheckboxChange(node.id)}
                />
                {node.name}
              </label>
            </div>
            {expandedItems[node.id] &&
              node.children.length > 0 &&
              renderTree(node.children)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div style={{ border: 'solid grey 1px', width: '100%' }}>
      <input
        placeholder='Search...'
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '100%', padding: '10px' }}
      />
      <ul style={{ listStyleType: 'none', paddingInlineStart: '0px' }}>
        {renderTree(filteredData)}
      </ul>
    </div>
  )
}

export default CheckboxTree
