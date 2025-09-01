import type { ReactNode } from 'react';

export default function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg ${className}`}>
      {children}
    </div>
  );
}
