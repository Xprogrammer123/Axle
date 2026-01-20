'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex tap-highlight-transparent hover:scale-[1.03] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 transition-transform duration-200 ease-out active:scale-[0.97] cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-base/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_0px_0px_3px_rgba(255,255,255,0.5)_inset,_0px_2px_2px_rgba(0,0,0,0.1)]';

    const variants = {
      primary: 'bg-accent hover:bg-accent-hover text-white font-semibold',
      secondary: 'bg-accent/20 hover:bg-accent/30 text-white border border-white/10',
      ghost: 'bg-accent/10 hover:bg-accent/20 text-white border border-transparent',
      destructive: 'bg-error hover:bg-error/90 text-white',
      outline: 'bg-accent/5 hover:bg-accent/10 text-white border border-base/40',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-8 py-2 text-sm',
      lg: 'px-6 py-3 text-sm',
    };

    // ✅ REAL click wave (separate layer)
    const createWave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      const button = e.currentTarget;
      const wave = document.createElement('span');

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      wave.style.width = wave.style.height = `${size}px`;
      wave.style.left = `${e.clientX - rect.left - size / 2}px`;
      wave.style.top = `${e.clientY - rect.top - size / 2}px`;

      wave.className =
        'absolute rounded-full bg-white/80 pointer-events-none animate-wave';

      button.appendChild(wave);

      wave.addEventListener('animationend', () => {
        wave.remove();
      });
    };

    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { y: -1 }}
        whileTap={
          disabled || loading
            ? undefined
            : {
                scale: 0.8,
                y: 1,
              }
        }
        
        onMouseDown={createWave}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <div className="loader-light" />}
        {!loading && icon}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
