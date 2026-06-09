import { useState, useEffect } from 'react'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [barcode, setBarcode] = useState('')
  const [retailPrice, setRetailPrice] = useState('')
  const [wholesalePrice, setWholesalePrice] = useState('')
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    window.api.products.getAll().then(setProducts)
  }, [])

  async function handleSave() {
    if (!name || !retailPrice) return

    await window.api.products.upsert({
      id: editingId,
      name,
      barcode: barcode || null,
      retail_price: parseFloat(retailPrice),
      wholesale_price: wholesalePrice ? parseFloat(wholesalePrice) : null,
      category: 'General',
      stock: 0,
      unit: 'pc'
    })

    setName('')
    setBarcode('')
    setRetailPrice('')
    setWholesalePrice('')
    setEditingId(null)

    const updated = await window.api.products.getAll()
    setProducts(updated)

    setMessage(editingId ? 'Product updated!' : 'Product added!')
    setTimeout(() => setMessage(''), 2000)
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setName(product.name)
    setBarcode(product.barcode || '')
    setRetailPrice(product.retail_price)
    setWholesalePrice(product.wholesale_price || '')
  }

  async function handleDelete(id) {
    await window.api.products.delete(id)
    const updated = await window.api.products.getAll()
    setProducts(updated)
  }

  function handleCancel() {
    setEditingId(null)
    setName('')
    setBarcode('')
    setRetailPrice('')
    setWholesalePrice('')
  }

  return (
    <div className="h-full bg-gray-100 p-6 flex gap-6">

      {/* Left - Form */}
      <div className="bg-white rounded-xl p-6 flex flex-col gap-3 w-96">
        <h2 className="text-xl font-bold text-gray-700">
          {editingId ? 'Edit Product' : 'Add Product'}
        </h2>

        <input
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          placeholder="Barcode"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          placeholder="Retail price"
          value={retailPrice}
          onChange={e => setRetailPrice(e.target.value)}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          placeholder="Wholesale price (optional)"
          value={wholesalePrice}
          onChange={e => setWholesalePrice(e.target.value)}
        />

        <div className="flex gap-2">
          {editingId && (
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-500 font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider"
          >
            {editingId ? 'Update' : 'Add Product'}
          </button>
        </div>

        {message && <p className="text-green-500 font-bold text-center">{message}</p>}
      </div>

      {/* Right - Products List */}
      <div className="flex-1 bg-white rounded-xl p-6 overflow-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          All Products
          <span className="text-gray-400 font-normal text-sm ml-2">{products.length} items</span>
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-3 text-gray-500 font-medium">Name</th>
              <th className="pb-3 text-gray-500 font-medium">Barcode</th>
              <th className="pb-3 text-gray-500 font-medium">Retail</th>
              <th className="pb-3 text-gray-500 font-medium">Wholesale</th>
              <th className="pb-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 font-medium">{product.name}</td>
                <td className="py-3 text-gray-500">{product.barcode || '—'}</td>
                <td className="py-3 text-blue-500 font-bold">₱{product.retail_price.toFixed(2)}</td>
                <td className="py-3 text-orange-500 font-bold">
                  {product.wholesale_price ? `₱${product.wholesale_price.toFixed(2)}` : '—'}
                </td>
                <td className="py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-sm px-3 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">No products yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ProductsPage