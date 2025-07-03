import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Settings, 
  Activity, 
  Zap,
  Eye,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  MessageSquare
} from 'lucide-react';
import { agentService } from '../services/api';

interface Agent {
  id: string;
  name: string;
  type: 'support' | 'dashboard';
  status: 'active' | 'idle' | 'error';
  description: string;
  lastActive: string;
  tasksCompleted: number;
  tools: string[];
  metrics: {
    successRate: number;
    avgResponseTime: string;
    totalQueries: number;
  };
}

export function AgentManagement() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'support-001',
      name: 'Support Agent',
      type: 'support',
      status: 'active',
      description: 'Handles client queries, order management, and service enrollment using CrewAI',
      lastActive: '2 minutes ago',
      tasksCompleted: 247,
      tools: ['MongoDBTool', 'ExternalAPI', 'EmailService', 'SMSService'],
      metrics: {
        successRate: 96,
        avgResponseTime: '1.2s',
        totalQueries: 1842
      }
    },
    {
      id: 'dashboard-001',
      name: 'Analytics Agent',
      type: 'dashboard',
      status: 'active',
      description: 'Provides analytics, metrics, and business intelligence using advanced AI',
      lastActive: '5 minutes ago',
      tasksCompleted: 89,
      tools: ['MongoDBTool', 'AnalyticsEngine', 'ReportGenerator'],
      metrics: {
        successRate: 98,
        avgResponseTime: '0.8s',
        totalQueries: 456
      }
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentStatus, setAgentStatus] = useState<any>(null);

  useEffect(() => {
    // Fetch real agent status
    const fetchAgentStatus = async () => {
      try {
        const status = await agentService.getAgentStatus();
        setAgentStatus(status);
      } catch (error) {
        console.error('Failed to fetch agent status:', error);
      }
    };

    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 3000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'idle': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'idle': return Clock;
      case 'error': return AlertCircle;
      default: return Bot;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Agent Management
        </h1>
        <p className="text-gray-600 text-lg">Monitor and manage your AI agents and their performance</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{agents.length}</p>
              <p className="text-gray-600 font-medium">Active Agents</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)}
              </p>
              <p className="text-gray-600 font-medium">Tasks Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {Math.round(agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / agents.length)}%
              </p>
              <p className="text-gray-600 font-medium">Avg Success Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {agents.reduce((sum, agent) => sum + agent.metrics.totalQueries, 0)}
              </p>
              <p className="text-gray-600 font-medium">Total Queries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent List */}
        <div className="space-y-6">
          {agents.map((agent) => {
            const StatusIcon = getStatusIcon(agent.status);
            const statusColor = getStatusColor(agent.status);
            
            return (
              <div key={agent.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${agent.type === 'support' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} shadow-lg`}>
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{agent.name}</h3>
                      <p className="text-gray-600 font-medium">{agent.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 text-${statusColor}-500`} />
                    <span className={`text-sm font-medium px-3 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700`}>
                      {agent.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{agent.tasksCompleted}</p>
                    <p className="text-sm text-gray-600 font-medium">Tasks Completed</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-2xl font-bold text-green-600">{agent.metrics.successRate}%</p>
                    <p className="text-sm text-green-700 font-medium">Success Rate</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">{agent.metrics.avgResponseTime}</p>
                    <p className="text-sm text-blue-700 font-medium">Avg Response</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="font-medium">Last active: {agent.lastActive}</span>
                  <span className="font-medium">{agent.metrics.totalQueries} total queries</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-semibold text-gray-700">Tools:</span>
                  <div className="flex flex-wrap gap-2">
                    {agent.tools.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedAgent(agent)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors font-medium">
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agent Details Panel */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          {selectedAgent ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                Agent Details: {selectedAgent.name}
              </h2>

              <div className="space-y-6">
                {/* Performance Metrics */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <p className="text-2xl font-bold text-green-600">{selectedAgent.metrics.successRate}%</p>
                      <p className="text-sm text-green-700 font-medium">Success Rate</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">{selectedAgent.metrics.avgResponseTime}</p>
                      <p className="text-sm text-blue-700 font-medium">Avg Response Time</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                      <p className="text-2xl font-bold text-purple-600">{selectedAgent.tasksCompleted}</p>
                      <p className="text-sm text-purple-700 font-medium">Tasks Completed</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <p className="text-2xl font-bold text-orange-600">{selectedAgent.metrics.totalQueries}</p>
                      <p className="text-sm text-orange-700 font-medium">Total Queries</p>
                    </div>
                  </div>
                </div>

                {/* Tools & Capabilities */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Tools & Capabilities</h3>
                  <div className="space-y-3">
                    {selectedAgent.tools.map((tool, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-800">{tool}</span>
                        <span className="ml-auto text-sm text-green-600 font-medium">Active</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Status */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                      <Cpu className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">CrewAI Framework</p>
                        <p className="text-sm text-gray-600">Agent runtime active</p>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Online</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <Database className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">MongoDB Connection</p>
                        <p className="text-sm text-gray-600">Database queries operational</p>
                      </div>
                      <span className="text-sm text-blue-600 font-medium">Connected</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">External APIs</p>
                        <p className="text-sm text-gray-600">Third-party integrations ready</p>
                      </div>
                      <span className="text-sm text-purple-600 font-medium">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Select an Agent</h3>
              <p className="text-gray-600">Choose an agent from the list to view detailed information and performance metrics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}