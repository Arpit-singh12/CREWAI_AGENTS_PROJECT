import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  User,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { orderService } from '../services/api';
import { useApi } from '../hooks/useApi';

interface Order {
  _id: string;
  order_number: string;
  service_name: string;
  amount: number;
  final_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'partial' | 'refunded';
  created_at: string;
  client_id: string;
}

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const { data: ordersData, loading, error, refetch } = useApi(
    () => orderService.getOrders(0, 100, statusFilter === 'all' ? undefined : statusFilter),
    [statusFilter]
  );

  const orders = ordersData?.orders || [];

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      case 'refunded': return XCircle;
      default: return Clock;
    }
  };

  const totalRevenue = orders.reduce((sum: number, order: Order) => 
    order.payment_status === 'paid' ? sum + order.final_amount : sum, 0
  );

  const pendingRevenue = orders.reduce((sum: number, order: Order) => 
    order.payment_status === 'unpaid' ? sum + order.final_amount : sum, 0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Order Management
          </h1>
          <p className="text-gray-600 text-lg">Track and manage all customer orders</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-medium">
          <Plus className="w-5 h-5" />
          Create Order
        </button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
              <p className="text-gray-600 font-medium">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {orders.filter((o: Order) => o.status === 'confirmed').length}
              </p>
              <p className="text-gray-600 font-medium">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-gray-600 font-medium">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">₹{pendingRevenue.toLocaleString()}</p>
              <p className="text-gray-600 font-medium">Pending Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by number or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
        </div>
        
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-300 rounded w-1/3" />
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-20" />
                  <div className="h-6 bg-gray-300 rounded w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">Error loading orders: {error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order: Order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{order.order_number}</h3>
                        <p className="text-gray-600 font-medium">{order.service_name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm font-medium">₹{order.final_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}