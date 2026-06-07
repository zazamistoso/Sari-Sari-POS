import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div>
        <h1 className="text-3xl font-bold text-red-500">
            Zara's Store POS
        </h1>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)