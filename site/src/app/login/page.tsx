'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Handle successful login here
      // Example: redirect to dashboard, store token, etc.
      console.log('Login successful:', data);
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c31432] from-30% to-[#240b36] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#c31432]">
            HTML2Convert
          </Link>
          <h2 className="text-2xl font-bold mt-6 text-gray-900">Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c31432] focus:border-[#c31432]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c31432] focus:border-[#c31432]"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#c31432] focus:ring-[#c31432] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Link href="/forgot-password" className="text-sm text-[#c31432] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-[#c31432] to-[#240b36] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c31432]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#c31432] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}