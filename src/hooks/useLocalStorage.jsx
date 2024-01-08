import { useState, useEffect } from 'react'

const useLocalStorageById = (id, key) => {
  // Initialize state to hold the retrieved item
  const [item, setItem] = useState(null)

  useEffect(() => {
    // Function to fetch item from local storage
    const getItemFromLocalStorage = () => {
      try {
        // Retrieve the stored data using the provided key
        const storedData = localStorage.getItem(key)

        // Parse the stored data as JSON
        const parsedData = JSON.parse(storedData)

        // Find the item with the specified ID
        const foundItem = parsedData.find((item) => item.id === id)

        // Update the state with the found item
        setItem(foundItem)
      } catch (error) {
        console.error('Error retrieving data from local storage:', error)
      }
    }

    // Call the function to fetch the item from local storage
    getItemFromLocalStorage()
  }, [id, key]) // Re-run the effect whenever id or key changes

  return item
}

export default useLocalStorageById
