"use client"

function QuantitySelector({ value, onChange, max, min = 1 }) {
  const options = []
  for (let i = min; i <= Math.min(max, 10); i++) {
    options.push(i)
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border border-gray-300 rounded-sm px-2 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
      aria-label="Quantity"
    >
      {options.map((num) => (
        <option key={num} value={num}>
          Qty: {num}
        </option>
      ))}
    </select>
  )
}

export default QuantitySelector
