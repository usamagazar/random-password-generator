import { useState, useCallback, useRef, useEffect } from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const passwordRef = useRef(null)

  // Password generator function
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*()_+-=[]{}|;:'\",.<>/?`" 
    
    for (let i = 0; i < length; i++) {
      const char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }
    
    setPassword(pass)
  }, [length, numberAllowed, charAllowed])

  // Generate password when component mounts and when any input changes
  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  // Generate password on page load/refresh
  useEffect(() => {
    passwordGenerator()
  }, [])

  const copyToClipboard = useCallback(() => {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => {
          setCopySuccess(false)
        }, 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }, [password])
  
  // Handle length change with immediate update
  const handleLengthChange = (e) => {
    setLength(parseInt(e.target.value))
  }

  // Toggle handlers with immediate updates
  const toggleNumbers = () => {
    setNumberAllowed(prev => !prev)
  }

  const toggleCharacters = () => {
    setCharAllowed(prev => !prev)
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 py-8">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Random Password Generator</h1>
        
        <div className="mb-6 flex overflow-hidden rounded-lg shadow">
          <input 
            type="text"
            value={password}
            className="w-full bg-gray-700 px-4 py-3 text-lg text-white outline-none"
            placeholder="Your password"
            readOnly
            ref={passwordRef}
          />
          <button 
            onClick={copyToClipboard} 
            className="bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 flex items-center justify-center min-w-20"
          >
            {copySuccess ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <div className="mb-6">
          <div className="mb-4 flex items-center">
            <label className="mr-3 w-24 text-white">Length: {length}</label>
            <input 
              type="range"
              value={length}
              min={6}
              max={32}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
              onChange={handleLengthChange}
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input 
                type="checkbox"
                checked={numberAllowed}
                id="numberInput"
                onChange={toggleNumbers}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="numberInput" className="text-white">Include Numbers</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={charAllowed}
                id="characterInput"
                onChange={toggleCharacters}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="characterInput" className="text-white">Include Symbols</label>
            </div>
          </div>
        </div>
        
        <button 
          onClick={passwordGenerator}
          className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
        >
          Generate New Password
        </button>
      </div>
    </div>
  )
}

export default App
