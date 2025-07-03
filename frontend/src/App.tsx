import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SupportAgent } from './components/SupportAgent';
import { DashboardAgent } from './components/DashboardAgent';
import { AgentManagement } from './components/AgentManagement';
import { ClientManagement } from './components/ClientManagement';
import { OrderManagement } from './components/OrderManagement';

type View = 'dashboard' | 'support' | 'analytics' | 'agents' | 'clients' | 'orders';

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage onLogin={login} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'support':
        return <SupportAgent />;
      case 'analytics':
        return <DashboardAgent />;
      case 'agents':
        return <AgentManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;