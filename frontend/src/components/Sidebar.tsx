import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings2,
  Bot,
  Users,
  ShoppingCart,
  Sparkles,
  Activity,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'support' | 'analytics' | 'agents' | 'clients' | 'orders') => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-cyan-400 to-blue-500' },
    { id: 'support', label: 'Support Agent', icon: MessageSquare, color: 'from-emerald-400 to-teal-500' },
    { id: 'analytics', label: 'Analytics Agent', icon: BarChart3, color: 'from-violet-400 to-purple-500' },
    { id: 'clients', label: 'Client Management', icon: Users, color: 'from-pink-400 to-rose-500' },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart, color: 'from-amber-400 to-orange-500' },
    { id: 'agents', label: 'Agent Management', icon: Settings2, color: 'from-red-400 to-pink-500' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl z-50 transition-all duration-300 ${
        isOpen ? 'w-72' : 'w-20 lg:w-20'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              {isOpen && (
                <div>
                  <h1 className="text-xl font-bold text-white">
                    AgentFlow
                  </h1>
                  <p className="text-sm text-slate-400 font-medium">Multi-Agent System</p>
                </div>
              )}
            </div>
            
            <button
              onClick={onToggle}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 lg:hidden"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id as any);
                if (window.innerWidth < 1024) onToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                currentView === item.id
                  ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${
                currentView === item.id ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              
              {isOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {currentView === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />
                  )}
                </>
              )}
              
              {!isOpen && currentView === item.id && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
            <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">AI Powered</span>
              </div>
              <p className="text-xs text-amber-200 leading-relaxed">
                CrewAI agents working 24/7 with intelligent automation
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">System Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-200 font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        )}

        {/* Toggle button for desktop */}
        <button
          onClick={onToggle}
          className="hidden lg:block absolute -right-3 top-8 p-1.5 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-full transition-colors duration-200"
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </>
  );
}