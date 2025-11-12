'use client';
import Link from 'next/link';
import { FaHome, FaTint, FaHospital, FaUsers, FaClipboardList, FaUserShield, FaChartBar, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <FaTint className="text-2xl" />
            <span className="text-xl font-bold">Blood Bank System</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            <FaBars />
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link href="/donor" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaUsers />
              <span>Donors</span>
            </Link>
            <Link href="/hospital" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaHospital />
              <span>Hospitals</span>
            </Link>
            <Link href="/inventory" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaTint />
              <span>Inventory</span>
            </Link>
            <Link href="/recipient" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaClipboardList />
              <span>Recipients</span>
            </Link>
            <Link href="/admin" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaUserShield />
              <span>Admin</span>
            </Link>
            <Link href="/reports" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaChartBar />
              <span>Reports</span>
            </Link>
            <Link href="/auth/login" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaSignOutAlt />
              <span>Login</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link href="/donor" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaUsers />
              <span>Donors</span>
            </Link>
            <Link href="/hospital" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaHospital />
              <span>Hospitals</span>
            </Link>
            <Link href="/inventory" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaTint />
              <span>Inventory</span>
            </Link>
            <Link href="/recipient" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaClipboardList />
              <span>Recipients</span>
            </Link>
            <Link href="/admin" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaUserShield />
              <span>Admin</span>
            </Link>
            <Link href="/reports" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaChartBar />
              <span>Reports</span>
            </Link>
            <Link href="/auth/login" className="flex items-center space-x-2 py-2 hover:bg-red-700 px-2 rounded">
              <FaSignOutAlt />
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
