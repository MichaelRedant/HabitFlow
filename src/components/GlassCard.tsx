import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

const GlassCard = forwardRef<HTMLDivElement, { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...rest }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
);

export default GlassCard;
