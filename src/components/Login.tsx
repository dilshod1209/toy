import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ChevronLeft } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function Login({ onLogin, onBack }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Login yoki parol noto\'g\'ri!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 border border-gray-100"
      >
        <button onClick={onBack} className="flex items-center text-gray-400 hover:text-gold mb-8 transition-colors text-sm">
          <ChevronLeft size={16} className="mr-1" /> Orqaga qaytish
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-dark">Admin Panel</h2>
          <p className="text-gray-400 mt-2">Boshqaruv tizimiga kirish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 block px-1">Login</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-3.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/5 transition-all" 
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 block px-1">Parol</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-3.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/5 transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium animate-shake">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-dark text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gold transition-all duration-300"
          >
            Kirish
          </button>
        </form>
      </motion.div>
    </div>
  );
}
