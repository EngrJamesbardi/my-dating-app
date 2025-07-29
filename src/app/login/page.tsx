"use client";
import { useState } from 'react';
import axios from 'axios';
import GoogleOAuthButton from '../../components/GoogleOAuthButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/profile';
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Login failed');
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-sm animate-fade-in" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 transition"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-4 animate-fade-in">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
        <GoogleOAuthButton />
        <div className="mt-4 text-center">
          <a href="/register" className="text-blue-600 hover:underline">Create an account</a>
        </div>
      </form>
    </div>
  );
}
