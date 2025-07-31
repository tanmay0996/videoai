'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function FormCard({ children, className, title, subtitle }: FormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl",
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
      
      <div className="relative z-10">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 mt-2">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}