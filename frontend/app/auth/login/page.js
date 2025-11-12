'use client';
import { useState } from 'react';
import { FaSignInAlt, FaUser, FaLock, FaTint } from 'react-icons/fa';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'donor',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData);
    alert('Login successful!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <FaTint className="text-5xl text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Blood Bank System</h1>
          <p className="text-red-100">Save lives, donate blood</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex items-center mb-6">
            <FaSignInAlt className="text-3xl text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Login As
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'donor' })}
                  className={`py-2 px-4 rounded-lg font-semibold transition ${
                    formData.userType === 'donor'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'hospital' })}
                  className={`py-2 px-4 rounded-lg font-semibold transition ${
                    formData.userType === 'hospital'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Hospital
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'admin' })}
                  className={`py-2 px-4 rounded-lg font-semibold transition ${
                    formData.userType === 'admin'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                <FaUser className="inline mr-2" />
                Email / Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                <FaLock className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-red-600 hover:text-red-800">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition flex items-center justify-center"
            >
              <FaSignInAlt className="mr-2" />
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-red-600 hover:text-red-800 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-red-100 text-sm">
          <p>&copy; 2024 Blood Bank System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
