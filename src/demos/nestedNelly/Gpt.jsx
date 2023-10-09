/* eslint-disable react/prop-types */
import { useState } from 'react'
import { filterItems, findParent } from './utils'

const CheckboxTree = ({ data }) => {
  const [checkedItems, setCheckedItems] = useState({})
  const [expandedItems, setExpandedItems] = useState({})
  const [searchQuery, setSearchQuery] = useState('') // State variable for search query

  const handleCheckboxChange = (itemId) => {
    const updatedCheckedItems = { ...checkedItems }
    updatedCheckedItems[itemId] = !updatedCheckedItems[itemId]

    if (updatedCheckedItems[itemId]) {
      // If checking a child, check all parents
      checkAllParents(data, itemId, updatedCheckedItems)
    } else {
      // If unchecking a parent, uncheck all children
      uncheckAllChildren(data, itemId, updatedCheckedItems)
    }

    setCheckedItems(updatedCheckedItems)
  }

  const checkAllParents = (nodes, childId, updatedCheckedItems) => {
    for (const node of nodes) {
      if (node.id === childId) {
        // Child found, check all its parents
        checkParents(node, updatedCheckedItems)
        return
      }
      if (node.children.length > 0) {
        checkAllParents(node.children, childId, updatedCheckedItems)
      }
    }
  }

  const checkParents = (node, updatedCheckedItems) => {
    updatedCheckedItems[node.id] = true
    const parent = findParent(data, node.id)
    if (parent) {
      checkParents(parent, updatedCheckedItems)
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

  const handlePrintCheckedIds = () => {
    const checkedIds = Object.keys(checkedItems).filter(
      (id) => checkedItems[id]
    )
    console.log(checkedIds)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Filter items based on search query
  const filteredData = filterItems(data, searchQuery)

  const renderTree = (nodes) => {
    return (
      <ul style={{ listStyleType: 'none' }}>
        {nodes.map((node) => (
          <li key={node.id}>
            <div>
              {node.children.length > 0 ? (
                <span
                  onClick={() => handleExpandToggle(node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {expandedItems[node.id] ? `v` : '>'}
                </span>
              ) : (
                <span>&nbsp;&nbsp;</span>
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
    <div
      style={{ border: 'solid red 1px', width: '300px', borderRadius: '10px' }}
    >
      <input
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button onClick={handlePrintCheckedIds}>Print Checked IDs</button>
      <div>
        <ul style={{ listStyleType: 'none' }}>{renderTree(filteredData)}</ul>
      </div>
    </div>
  )
}

export default CheckboxTree
