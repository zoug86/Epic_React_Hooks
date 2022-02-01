// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, { useState, useEffect, useRef } from 'react'

function useLocalStorageState(key, defaultValue = '', { serialize = JSON.stringify, deserialize = JSON.parse } = {}) {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = useRef(key)

  useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    localStorage.setItem(key, serialize(state))
  }, [state, key, serialize]);

  return [state, setState]
}
function Greeting({ initialName = '' }) {
  const [name, setName] = useLocalStorageState('name', initialName)
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
