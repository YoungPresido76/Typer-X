import React from 'react';
import { motion } from 'motion/react';
import { Home, GitBranch, Trophy, ShoppingBag, Settings } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  active: NavTab;
  onNavigate: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'home',        label: 'Home',       Icon: Home },
  { id: 'tree',        label: 'Tree',       Icon: GitBranch },
  { id: 'leaderboard', label: 'Ranks',      Icon: Trophy },
  { id: 'shop',        label: 'Shop',       Icon: ShoppingBag },
  { id: 'settings',   label: 'Settings',   Icon: Settings },
];

export const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  return (
    <nav className="relative flex items-center justify-around px-2 py-2 bg-[#0F1114]/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="relative flex flex-col items-center justify-center gap-1 w-14 py-1 cursor-pointer group"
          >
            {/* Active pill indicator */}
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            <motion.div
              animate={{ scale: isActive ? 1.12 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500/20 to-violet-500/15'
                  : 'group-active:bg-white/5'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
                }`}
              />
            </motion.div>

            <span
              className={`text-[9px] font-bold tracking-wide transition-colors duration-200 ${
                isActive ? 'text-cyan-400' : 'text-gray-600'
              }`}
            >
              {label.toUpperCase()}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
