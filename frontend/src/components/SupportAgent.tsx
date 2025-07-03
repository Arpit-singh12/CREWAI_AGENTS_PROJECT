import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  User, 
  Bot,
  Search,
  Clock,
  CheckCircle,
  Zap,
  Sparkles,
  Activity,
  Menu
} from 'lucide-react';
import { agentService } from '../services/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  loading?: boolean;
}

export function SupportAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Support Agent powered by CrewAI. I can help you with client queries, order status, payment information, and course details. I have access to your MongoDB database and external APIs. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const sampleQueries = [
    "What classes are available this week?",
    "Has order #12345 been paid?", 
    "Create an order for Yoga Beginner for client Priya Sharma",
    "Show me pending payments",
    "Find client by email priya@example.com",
    "How many clients enrolled this month?"
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
      const response = await agentService.querySupportAgent(currentQuery);
      
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4">
          AI Support Agent
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Powered by CrewAI with MongoDB integration and external API access for comprehensive customer support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden h-[700px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Support Agent</h3>
                    <p className="text-emerald-100 font-medium">CrewAI • MongoDB • External APIs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Online</span>
                  </div>
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md lg:max-w-lg px-6 py-4 rounded-2xl shadow-xl ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                      : 'bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 text-white'
                  }`}>
                    <div className="flex items-start gap-3">
                      {message.sender === 'agent' && (
                        <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {message.sender === 'user' && (
                        <div className="p-2 bg-white/20 rounded-lg">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-line leading-relaxed">
                          {message.text}
                        </p>
                        <p className={`text-xs mt-3 ${
                          message.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
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
                  <div className="bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 px-6 py-4 rounded-2xl shadow-xl max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm text-slate-300 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-700/50 bg-slate-800/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about clients, orders, payments, courses, or anything else..."
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium text-white placeholder-slate-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`lg:block ${showSidebar ? 'block' : 'hidden'} space-y-6`}>
          {/* Sample Queries */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Sample Queries
            </h3>
            <div className="space-y-3">
              {sampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQuery(query)}
                  className="w-full text-left p-3 text-sm bg-slate-700/30 hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-slate-600/30 rounded-xl transition-all duration-200 font-medium text-slate-300 hover:text-white"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Capabilities */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-400" />
              Agent Capabilities
            </h3>
            <div className="space-y-3">
              {[
                'Client search & management',
                'Order status tracking',
                'Payment information',
                'Course & class details',
                'External API integration',
                'Natural language processing'
              ].map((capability, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-slate-300">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30 shadow-xl">
            <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-200">CrewAI Agent</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-300 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-200">MongoDB</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-xs text-emerald-300 font-medium">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-200">External APIs</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-xs text-emerald-300 font-medium">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}