import { useState, useEffect } from 'react'

function ProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    window.api.products.getAll().then(setProducts)
  }, [])

  return (
    <div className="h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-500 mb-6">Products</h1>
      <p>{products.length} products found</p>
    </div>
  )
}

export default ProductsPage