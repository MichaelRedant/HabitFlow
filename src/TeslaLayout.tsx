import React from 'react';
import { FiHome, FiCalendar, FiUser, FiSettings } from 'react-icons/fi';

export default function TeslaLayout() {
  return (
    <div className="flex h-screen text-slate-100">
      {/* Navigation bar */}
      <nav className="w-20 flex flex-col items-center py-6 bg-black/80 backdrop-blur-xl border-r border-white/10">
        <div className="mb-8 text-red-500 text-2xl font-bold">⚡</div>
        <ul className="flex-1 flex flex-col gap-6">
          <li>
            <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <FiHome />
            </button>
          </li>
          <li>
            <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <FiCalendar />
            </button>
          </li>
          <li>
            <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <FiUser />
            </button>
          </li>
        </ul>
        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <FiSettings />
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 relative overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="p-8">
          <section className="max-w-3xl mx-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Welkom</h1>
            <p className="text-slate-300">
              Deze layout demonstreert een Tesla futuristische stijl met Apple Glass elementen.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
