const statusStyles = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-800",
  New: "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
