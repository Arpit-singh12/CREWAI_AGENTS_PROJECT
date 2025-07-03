import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Menu
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { agentService } from '../services/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

export function DashboardAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Analytics Agent powered by CrewAI. I can provide comprehensive business insights, analytics, and metrics. I have access to your MongoDB database for real-time data analysis. What would you like to know about your business?",
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 135 },
    { month: 'Mar', revenue: 48000, orders: 128 },
    { month: 'Apr', revenue: 61000, orders: 156 },
    { month: 'May', revenue: 55000, orders: 142 },
    { month: 'Jun', revenue: 67000, orders: 178 },
  ];

  const courseData = [
    { name: 'Yoga', students: 45, revenue: 67500, completion: 92 },
    { name: 'Pilates', students: 32, revenue: 64000, completion: 88 },
    { name: 'Meditation', students: 28, revenue: 28000, completion: 95 },
    { name: 'Dance', students: 24, revenue: 36000, completion: 85 },
  ];

  const attendanceData = [
    { name: 'Present', value: 87, color: '#10B981' },
    { name: 'Absent', value: 13, color: '#EF4444' },
  ];

  const sampleQueries = [
    "How much revenue did we generate this month?",
    "Which course has the highest enrollment?",
    "What is the attendance percentage for Pilates classes?",
    "How many inactive clients do we have?",
    "Show me the top 5 clients by revenue contribution",
    "What's our client retention rate?"
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const response = await agentService.queryDashboardAgent(currentQuery);
      
      const agentMessage: Message = {
        id: messages.length + 2,
        text: response.response || response.error || "I apologize, but I encountered an issue processing your request. Please try again.",
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm currently unable to connect to the backend services. Please ensure the backend server is running on port 8000. You can start it with: `npm run backend`",
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSampleQuery = (query: string) => {
    setInputText(query);
  };

  const businessMetrics = [
    { label: 'Total Revenue', value: '₹3,48,000', change: '+18%', icon: DollarSign, gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Outstanding Payments', value: '₹18,900', change: '-12%', icon: TrendingUp, gradient: 'from-red-400 to-pink-500' },
    { label: 'Active Clients', value: '892', change: '+8%', icon: Users, gradient: 'from-cyan-400 to-blue-500' },
    { label: 'Avg Attendance', value: '87%', change: '+5%', icon: Activity, gradient: 'from-violet-400 to-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent mb-4">
          AI Analytics Dashboard
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Business insights and performance metrics powered by CrewAI with real-time MongoDB analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {businessMetrics.map((metric, index) => (
          <div key={index} className="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.gradient} shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                metric.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-slate-400 font-medium">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Chat Interface */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden h-[600px] flex flex-col">
          <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Analytics Agent</h3>
                  <p className="text-sm text-purple-100">Ask me anything about your business data</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-xl ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' 
                    : 'bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 text-white'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.sender === 'agent' && (
                      <div className="p-1 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <div className="p-1 bg-white/20 rounded-lg">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {message.text}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-purple-100' : 'text-slate-400'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 px-4 py-3 rounded-2xl shadow-xl max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about revenue, clients, courses..."
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-white placeholder-slate-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sample Queries */}
        <div className={`lg:block ${showSidebar ? 'block' : 'hidden'} bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl`}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-400" />
            Sample Analytics Queries
          </h3>
          <div className="space-y-3">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(query)}
                className="w-full text-left p-3 text-sm bg-slate-700/30 hover:bg-violet-500/20 hover:border-violet-500/30 border border-slate-600/30 rounded-xl transition-all duration-200 font-medium text-slate-300 hover:text-white"
              >
                {query}
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/30">
            <h4 className="font-bold text-violet-300 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Capabilities
            </h4>
            <div className="space-y-2 text-sm">
              {[
                'Revenue analysis & forecasting',
                'Client behavior insights',
                'Course performance metrics',
                'Attendance tracking',
                'Business KPI monitoring'
              ].map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                  <span className="text-violet-200 font-medium">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Revenue Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: '1px solid #475569', 
                  borderRadius: '12px',
                  color: '#ffffff'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#06b6d4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Course Enrollment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: '1px solid #475569', 
                  borderRadius: '12px',
                  color: '#ffffff'
                }} 
              />
              <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}