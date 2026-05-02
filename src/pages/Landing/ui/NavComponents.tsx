import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const NavItem = ({
  label,
  children,
  isOpen,
  onClick,
}: {
  label: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
      >
        {label}
        {children && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {children && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-0 mt-2 w-64 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export const DropdownLink = ({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) => (
  <a
    href={href}
    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group no-underline"
  >
    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-studio group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white" />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-bold text-white group-hover:text-studio transition-colors">
        {title}
      </span>
      <span className="text-[11px] text-zinc-500 leading-tight">{description}</span>
    </div>
  </a>
);

