export default function StatsCard({ icon, title, value, color = "bg-blue-500" }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${color} p-4 rounded-full text-white text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
