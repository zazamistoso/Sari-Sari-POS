import { useState } from 'react'
import POSPage from './pages/POSPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  const [page, setPage] = useState('pos')

  return (
    <div className="h-screen">
      {page === 'pos' ? <POSPage /> : <ProductsPage />}
    </div>
  )
}

export default App