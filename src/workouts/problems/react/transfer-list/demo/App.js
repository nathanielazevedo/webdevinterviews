import './styles.css'
import List from './List'
import { items } from './data'
import { useState } from 'react'
import ActionButtons from './ActionButtons'
import { not, intersection } from './utils'

const App = () => {
  const [leftItems, setLeftItems] = useState(items)
  const [rightItems, setRightItems] = useState([])
  const [checkedItems, setCheckedItems] = useState([])

  const leftCheckedItems = intersection(checkedItems, leftItems)
  const rightCheckedItems = intersection(checkedItems, rightItems)

  const handleToggle = (item) => {
    const currentIndex = checkedItems.indexOf(item)
    const newChecked = [...checkedItems]

    if (currentIndex === -1) {
      newChecked.push(item)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setCheckedItems(newChecked)
  }

  const moveRight = () => {
    setRightItems(rightItems.concat(leftCheckedItems))
    setLeftItems(not(leftItems, leftCheckedItems))
    setCheckedItems(not(checkedItems, leftCheckedItems))
  }

  const moveLeft = () => {
    setLeftItems(leftItems.concat(rightCheckedItems))
    setRightItems(not(rightItems, rightCheckedItems))
    setCheckedItems(not(checkedItems, rightCheckedItems))
  }

  return (
    <div className='App flex'>
      <List items={leftItems} handleToggle={handleToggle} />
      <ActionButtons moveRight={moveRight} moveLeft={moveLeft} />
      <List items={rightItems} handleToggle={handleToggle} />
    </div>
  )
}

export default App
