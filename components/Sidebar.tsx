import React from 'react';
import { LayoutDashboard, Receipt, Bot, PieChart, Landmark } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts' as ViewState, label: 'Accounts & Debt', icon: Landmark },
    { id: 'transactions' as ViewState, label: 'Transactions', icon: Receipt },
    { id: 'ai-advisor' as ViewState, label: 'AI Advisor', icon: Bot },
  ];

  return (
    <div className="w-20 md:w-64 bg-surface border-r border-slate-700 flex flex-col h-full transition-all duration-300 z-20 relative">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-700">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          <PieChart size={24} />
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight text-white">My Accounts</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
            >
              <item.icon size={24} className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200'} />
              <span className={`hidden md:block font-medium ${isActive ? 'text-primary' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary hidden md:block shadow-[0_0_10px_currentColor]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-900/50 rounded-xl p-4 hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">System Status</span>
          </div>
          <p className="text-xs text-slate-500">Bank APIs Connected.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;