"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // HARDCODED CREDENTIALS
    if (username === 'admin' && password === '1234') {
      // Set Auth Cookie
      document.cookie = "auth_token=valid_token; path=/; max-age=86400";
      // Redirect to Projects Page first
      router.push('/projects');
    } else {
      setError('Invalid credentials (Try: admin / 1234)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96 border border-gray-700">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600 rounded-full mb-3">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-2xl font-bold">Agile AI</h1>
          <p className="text-gray-400 text-sm">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold flex justify-center items-center gap-2 transition">
            Sign In <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}