import { useState } from 'react'
import POSPage from './pages/POSPage'
import ProductsPage from './pages/ProductsPage'
import ReportsPage from './pages/ReportsPage'

function App() {
  const [page, setPage] = useState('pos')

  return (
    <div className="h-screen flex flex-col">

      {/* Navigation */}
      <nav className="no-print bg-white border-b border-gray-200 px-6 py-3 flex gap-4">
        <button
          onClick={() => setPage('pos')}
          className={`font-bold uppercase tracking-wider text-sm px-4 py-2 rounded-lg ${
            page === 'pos' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          POS
        </button>
        <button
          onClick={() => setPage('products')}
          className={`font-bold uppercase tracking-wider text-sm px-4 py-2 rounded-lg ${
            page === 'products' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setPage('reports')}
          className={`font-bold uppercase tracking-wider text-sm px-4 py-2 rounded-lg ${
            page === 'reports' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Reports
        </button>
      </nav>

      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {page === 'pos' && <POSPage />}
        {page === 'products' && <ProductsPage />}
        {page === 'reports' && <ReportsPage />}
      </div>

    </div>
  )
}

export default App