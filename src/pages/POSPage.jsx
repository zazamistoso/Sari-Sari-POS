function POSPage() {
  return (
    <div className="h-screen bg-gray-950 text-white flex">
      
      {/* Left - Cart */}
        <div className="flex-1 p-4 border-r border-gray-200 bg-gray-100 text-gray-900">
        <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider text-gray-500">Cart</h2>
        </div>

      {/* Right - Summary */}
        <div className="w-80 p-4 bg-white text-gray-900">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider text-gray-500">Summary</h2>
        </div>

    </div>
  )
}

export default POSPage