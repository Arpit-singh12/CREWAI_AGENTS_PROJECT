import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp,
  Calendar,
  BookOpen,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Zap,
  Clock,
  BarChart3
} from 'lucide-react';
import { analyticsService, clientService, orderService } from '../services/api';
import { useApi } from '../hooks/useApi';

interface DashboardStats {
  totalClients: number;
  activeOrders: number;
  monthlyRevenue: number;
  courseCompletion: number;
}

interface ActivityItem {
  id: number;
  type: string;
  message: string;
  time: string;
  status: 'success' | 'pending' | 'info';
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeOrders: 0,
    monthlyRevenue: 0,
    courseCompletion: 87
  });
  
  //Enabling manual loading for loading animation to stop...change..
  const [manualLoading, setManualLoading] = useState(false);

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [upcomingClasses] = useState([
    { name: 'Yoga Beginner', instructor: 'Sarah Johnson', time: '9:00 AM', students: 12, capacity: 20 },
    { name: 'Pilates Advanced', instructor: 'Mike Chen', time: '11:00 AM', students: 8, capacity: 15 },
    { name: 'Meditation', instructor: 'Lisa Wang', time: '6:00 PM', students: 15, capacity: 25 },
  ]);

  const { data: revenueData, loading: revenueLoading, refetch: refetchRevenue } = useApi(
    () => analyticsService.getRevenueAnalytics(),
    []
  );

  const { data: clientData, loading: clientLoading, refetch: refetchClients } = useApi(
    () => analyticsService.getClientAnalytics(),
    []
  );

  const { data: ordersData, loading: ordersLoading, refetch: refetchOrders } = useApi(
    () => orderService.getOrders(0, 10),
    []
  );

  useEffect(() => {
    if (revenueData && clientData && ordersData) {
      setStats({
        totalClients: clientData.total_clients || 0,
        activeOrders: ordersData.orders?.filter((order: any) => order.status === 'pending').length || 0,
        monthlyRevenue: revenueData.current_month_revenue?.total_revenue || 0,
        courseCompletion: 87
      });

      const newActivities: ActivityItem[] = [];
      
      if (ordersData.orders) {
        ordersData.orders.slice(0, 3).forEach((order: any, index: number) => {
          newActivities.push({
            id: index + 1,
            type: 'order',
            message: `Order ${order.order_number} for ${order.service_name}`,
            time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: order.status === 'confirmed' ? 'success' : 'pending'
          });
        });
      }

      newActivities.push({
        id: newActivities.length + 1,
        type: 'class',
        message: 'Pilates class scheduled for tomorrow',
        time: '15 min ago',
        status: 'info'
      });

      setActivities(newActivities);
    }
  }, [revenueData, clientData, ordersData]);

  const refreshData = async () => {
    setManualLoading(true);
    await Promise.all([refetchRevenue(), refetchClients(), refetchOrders()]);
    setTimeout(() => setManualLoading(false), 10000); // setting loading animation for the 10 sec only...
    await Promise.all([refetchRevenue(), refetchClients(), refetchOrders()]);
  };

  const isLoading = manualLoading; // only for using the manual loading....
  
  //const isLoading = revenueLoading || clientLoading || ordersLoading;

  const statsConfig = [
    { 
      label: 'Total Clients', 
      value: stats.totalClients.toLocaleString(), 
      change: '+12%', 
      trend: 'up',
      icon: Users, 
      gradient: 'from-cyan-400 to-blue-500'
    },
    { 
      label: 'Active Orders', 
      value: stats.activeOrders.toString(), 
      change: '+8%', 
      trend: 'up',
      icon: ShoppingCart, 
      gradient: 'from-emerald-400 to-teal-500'
    },
    { 
      label: 'Monthly Revenue', 
      value: `₹${stats.monthlyRevenue.toLocaleString()}`, 
      change: '+15%', 
      trend: 'up',
      icon: DollarSign, 
      gradient: 'from-violet-400 to-purple-500'
    },
    { 
      label: 'Course Completion', 
      value: `${stats.courseCompletion}%`, 
      change: '+3%', 
      trend: 'up',
      icon: TrendingUp, 
      gradient: 'from-amber-400 to-orange-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-lg">Monitor your business performance and agent activities</p>
        </div>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 font-medium"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <div key={index} className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-1">
                {isLoading ? (
                  <div className="h-8 bg-slate-700 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </h3>
              <p className="text-slate-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Recent Activities
          </h2>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-slate-700/30">
                    <div className="w-3 h-3 bg-slate-600 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-600 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-600 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-700/30 transition-all duration-200 border border-slate-700/30">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${
                    activity.status === 'success' ? 'bg-emerald-400' :
                    activity.status === 'pending' ? 'bg-amber-400' : 'bg-cyan-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.message}</p>
                    <p className="text-slate-400 text-sm">{activity.time}</p>
                  </div>
                  {activity.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Today's Classes
          </h2>
          
          <div className="space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="group p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{class_.name}</h3>
                      <p className="text-slate-400 font-medium">{class_.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-lg">{class_.time}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400 font-medium">
                          {class_.students}/{class_.capacity}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        class_.students / class_.capacity > 0.8 ? 'bg-red-400' :
                        class_.students / class_.capacity > 0.6 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Quick Support</h3>
              <p className="text-slate-400">Ask AI agent anything</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Analytics</h3>
              <p className="text-slate-400">View detailed insights</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Schedule</h3>
              <p className="text-slate-400">Manage appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}