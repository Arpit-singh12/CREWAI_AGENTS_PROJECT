import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import { clientService } from '../services/api';
import { useApi } from '../hooks/useApi';

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  enrolled_courses: string[];
}

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clientsData, loading, error, refetch } = useApi(
    () => clientService.getClients(0, 100, statusFilter === 'all' ? undefined : statusFilter),
    [statusFilter]
  );

  const clients = clientsData?.clients || [];

  const filteredClients = clients.filter((client: Client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return UserCheck;
      case 'inactive': return UserX;
      case 'suspended': return UserX;
      default: return Users;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Client Management
          </h1>
          <p className="text-gray-600 text-lg">Manage your clients and their information</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{clients.length}</p>
              <p className="text-gray-600 font-medium">Total Clients</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {clients.filter((c: Client) => c.status === 'active').length}
              </p>
              <p className="text-gray-600 font-medium">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
              <UserX className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {clients.filter((c: Client) => c.status === 'inactive').length}
              </p>
              <p className="text-gray-600 font-medium">Inactive</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
              <UserX className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {clients.filter((c: Client) => c.status === 'suspended').length}
              </p>
              <p className="text-gray-600 font-medium">Suspended</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Client Directory</h2>
        </div>
        
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-gray-300 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-300 rounded w-1/3" />
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">Error loading clients: {error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client: Client) => {
              const StatusIcon = getStatusIcon(client.status);
              return (
                <div key={client._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{client.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm font-medium">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {new Date(client.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(client.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
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