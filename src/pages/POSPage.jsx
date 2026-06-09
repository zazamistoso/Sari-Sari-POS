import { useState } from 'react'

function POSPage() {
  const [mode, setMode] = useState('retail')
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [tendered, setTendered] = useState('')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const change = tendered !== '' ? parseFloat(tendered) - total : null

  async function handleSearch(query) {
    setSearch(query)
    if (query.length < 1) {
      setSearchResults([])
      return
    }
    const results = await window.api.products.search(query)
    setSearchResults(results)
  }

  function addToCart(product) {
    const price = mode === 'wholesale' && product.wholesale_price
      ? product.wholesale_price
      : product.retail_price

    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unit_price }
            : i
        )
      }
      return [...prev, {
        product_id: product.id,
        name: product.name,
        barcode: product.barcode,
        unit_price: price,
        quantity: 1,
        subtotal: price,
      }]
    })

    setSearch('')
    setSearchResults([])
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.product_id !== productId))
  }

  return (
    <div className="h-full bg-gray-950 text-white flex">

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

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 bg-white"
            placeholder="Search product by name..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
              {searchResults.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Retail: ₱{product.retail_price.toFixed(2)}
                    {product.wholesale_price && ` · Wholesale: ₱${product.wholesale_price.toFixed(2)}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center mt-20">No items yet. Scan a barcode or search to start.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 text-gray-500 font-medium">Item</th>
                  <th className="pb-3 text-gray-500 font-medium">Price</th>
                  <th className="pb-3 text-gray-500 font-medium">Qty</th>
                  <th className="pb-3 text-gray-500 font-medium">Subtotal</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.product_id} className="border-b border-gray-100">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-gray-500">₱{item.unit_price.toFixed(2)}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3 font-bold text-blue-500">₱{item.subtotal.toFixed(2)}</td>
                    <td className="py-3">
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Right - Summary */}
      <div className="w-80 p-4 bg-white text-gray-900 flex flex-col gap-4">
        <h2 className="text-3xl font-bold uppercase tracking-wider text-gray-500">Summary</h2>

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Total</p>
          <p className="text-4xl font-bold text-gray-900">₱{total.toFixed(2)}</p>
        </div>

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

            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Total</p>
              <p className="text-4xl font-bold text-gray-900">₱{total.toFixed(2)}</p>
            </div>

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

            {change !== null && change >= 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Change</p>
                <p className="text-4xl font-bold text-green-500">₱{change.toFixed(2)}</p>
              </div>
            )}

            {change !== null && change < 0 && (
              <p className="text-red-500 font-bold text-center">Insufficient amount</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 py-3 rounded-lg border border-gray-300 font-bold uppercase tracking-wider text-gray-500"
              >
                Cancel
              </button>
              <button
                disabled={change !== null && change < 0}
                className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold uppercase tracking-wider disabled:opacity-50"
              >
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