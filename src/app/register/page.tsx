"use client";
import { useState } from 'react';
import axios from 'axios';
import GoogleOAuthButton from '../../components/GoogleOAuthButton';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/register', { email, password, name, age, gender });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/profile';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-sm animate-fade-in" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
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
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 transition"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 transition"
          value={age}
          onChange={e => setAge(Number(e.target.value))}
          required
        />
        <select
          className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 transition"
          value={gender}
          onChange={e => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {error && <div className="text-red-500 mb-4 animate-fade-in">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Register</button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline">Already have an account?</a>
        </div>
      </form>
      <div className="mt-4">
        <GoogleOAuthButton />
      </div>
    </div>
  );
}
