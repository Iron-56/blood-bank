'use client';
import { FaTint, FaHeartbeat, FaHandHoldingHeart, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <FaTint className="text-8xl text-red-600 mx-auto mb-6 animate-pulse" />
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Save Lives Through <span className="text-red-600">Blood Donation</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Every drop counts. Join our blood bank community and make a difference today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/donor/register">
              <button className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-lg font-semibold shadow-lg">
                Become a Donor
              </button>
            </Link>
            <Link href="/hospital/request">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-lg">
                Request Blood
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-lg font-semibold shadow-lg">
                View Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center hover:shadow-2xl transition">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeartbeat className="text-4xl text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Registration</h3>
            <p className="text-gray-600">
              Quick and simple donor registration process. Sign up in minutes and start saving lives.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 text-center hover:shadow-2xl transition">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTint className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Real-Time Tracking</h3>
            <p className="text-gray-600">
              Monitor blood inventory levels and availability in real-time across all blood types.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 text-center hover:shadow-2xl transition">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHandHoldingHeart className="text-4xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Efficient Matching</h3>
            <p className="text-gray-600">
              Intelligent blood type matching system connects recipients with compatible donors instantly.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-red-600 rounded-2xl shadow-2xl p-12 text-white">
          <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <FaUsers className="text-6xl mx-auto mb-4 opacity-90" />
              <p className="text-5xl font-bold mb-2">1,284</p>
              <p className="text-xl opacity-90">Active Donors</p>
            </div>
            <div className="text-center">
              <FaTint className="text-6xl mx-auto mb-4 opacity-90" />
              <p className="text-5xl font-bold mb-2">195</p>
              <p className="text-xl opacity-90">Units Available</p>
            </div>
            <div className="text-center">
              <FaHandHoldingHeart className="text-6xl mx-auto mb-4 opacity-90" />
              <p className="text-5xl font-bold mb-2">2,847</p>
              <p className="text-xl opacity-90">Lives Saved</p>
            </div>
            <div className="text-center">
              <FaHeartbeat className="text-6xl mx-auto mb-4 opacity-90" />
              <p className="text-5xl font-bold mb-2">42</p>
              <p className="text-xl opacity-90">Partner Hospitals</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of donors who are helping save lives every day
          </p>
          <Link href="/donor/register">
            <button className="px-12 py-5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xl font-semibold shadow-lg">
              Register as a Donor Today
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Blood Bank Management System. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Saving lives, one donation at a time.</p>
        </div>
      </footer>
    </div>
  );
}

