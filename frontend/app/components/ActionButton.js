import Link from 'next/link';

export default function ActionButton({ icon, title, description, href, color = "bg-red-500" }) {
  return (
    <Link href={href}>
      <div className={`${color} hover:opacity-90 text-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer`}>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-5xl">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </Link>
  );
}
