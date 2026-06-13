import { useState, useEffect } from 'react'

function ReportsPage() {
  const [period, setPeriod] = useState('today')
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    window.api.transactions.getSummary(period).then(setSummary)
  }, [period])

  if (!summary) return null

  return (
    <div className="h-full bg-gray-100 p-6">
      <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-500 mb-6">Sales Report</h1>

      {/* Period selector */}
      <div className="flex gap-2 mb-4 no-print">
        {['today', 'week', 'month'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm ${
              period === p ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'
            }`}
          >
            {p === 'today' ? 'Today' : p === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
          </button>
        ))}
      </div>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="no-print mb-6 px-6 py-2 bg-green-500 text-white rounded-lg font-bold uppercase tracking-wider text-sm"
      >
        Print This Report
      </button>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div className="bg-white rounded-xl p-6">
          <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Total Sales</p>
          <p className="text-4xl font-bold text-blue-500">₱{summary.total_sales.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-1">{summary.transaction_count} transactions</p>
        </div>
        <div className="bg-white rounded-xl p-6">
          <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Retail Sales</p>
          <p className="text-4xl font-bold text-gray-900">₱{summary.retail_sales.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-6">
          <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Wholesale Sales</p>
          <p className="text-4xl font-bold text-orange-500">₱{summary.wholesale_sales.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage