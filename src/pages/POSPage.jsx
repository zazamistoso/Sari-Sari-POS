import { useState } from 'react'

function POSPage() {
    const [mode, setMode] = useState('retail')
    const [cart, setCart] = useState([])
    const [showCheckout, setShowCheckout] = useState(false)
    const [tendered, setTendered] = useState('')
    const total = cart.reduce((sum, item) => sum + item.subtotal, 0)
    const change = tendered !== '' ? parseFloat(tendered) - total : null
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
        <div className="w-80 p-4 bg-white text-gray-900 flex flex-col gap-4">
            <h2 className="text-3xl font-bold uppercase tracking-wider text-gray-500">Summary</h2>

            {/* Total */}
            <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Total</p>
                <p className="text-4xl font-bold text-gray-900">₱{total.toFixed(2)}</p>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full py-4 bg-blue-500 text-white font-bold text-xl rounded-lg uppercase tracking-wider"
            >
              Checkout
            </button>
        </div>

        {/* Checkout Modal */}
          {showCheckout && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 w-96 text-gray-900 flex flex-col gap-4">
                
                <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-500">Checkout</h2>

                {/* Total */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Total</p>
                  <p className="text-4xl font-bold text-gray-900">₱{total.toFixed(2)}</p>
                </div>

                {/* Cash Received */}
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-2">Cash Received</p>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-3 text-2xl font-bold focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                    value={tendered}
                    onChange={e => setTendered(e.target.value)}
                  />
                </div>

                {/* Change */}
                {change !== null && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Change</p>
                    <p className="text-4xl font-bold text-green-500">₱{change.toFixed(2)}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 py-3 rounded-lg border border-gray-300 font-bold uppercase tracking-wider text-gray-500"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold uppercase tracking-wider">
                    Confirm
                  </button>
                </div>

              </div>
            </div>
          )}
    </div>
  )
}

export default POSPage