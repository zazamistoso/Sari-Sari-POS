import { useState } from 'react'

function POSPage() {
    const [mode, setMode] = useState('retail')
    const [cart, setCart] = useState([])
  return (
    <div className="h-screen bg-gray-950 text-white flex">
      
      {/* Left - Cart */}
        <div className="flex-1 p-4 border-r border-gray-200 bg-gray-100 text-gray-900 flex flex-col">
        
        {/* Toggle row */}
        <div className="flex items-end justify-between mb-4">
            <h2 className="text-3xl font-bold uppercase tracking-wider text-gray-500 leading-none">Cart</h2>
            <button
            onClick={() => setMode(mode === 'retail' ? 'wholesale' : 'retail')}
            className="py-2 px-6 rounded-lg font-bold text-white uppercase tracking-wider"
            style={{ backgroundColor: mode === 'retail' ? '#3b82f6' : '#f97316' }}
            >
            {mode}
            </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
            <p className="text-gray-400 text-center mt-20">No items yet. Scan a barcode to start.</p>
            ) : (
            <p>items go here</p>
            )}
        </div>

        </div>

      {/* Right - Summary */}
        <div className="w-80 p-4 bg-white text-gray-900">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider text-gray-500">Summary</h2>
        </div>

    </div>
  )
}

export default POSPage