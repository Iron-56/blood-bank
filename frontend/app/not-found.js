'use client';
import Link from 'next/link';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <FaExclamationTriangle className="text-9xl text-yellow-500 mx-auto mb-6" />
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button className="flex items-center mx-auto px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-lg font-semibold">
            <FaHome className="mr-2" />
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}
