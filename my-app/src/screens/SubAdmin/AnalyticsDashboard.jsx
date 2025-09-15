
import React from 'react';
  // import Navbar here
import { 
  MessageSquare, 
  Bot, 
  UserCheck, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const AnalyticsDashboard = () => {
  return (
    <div className="flex h-screen">
    
     
        {/* Dashboard Content */}
        <div className="p-6 flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive overview of system performance and metrics</p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Calls/Chats</p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-green-600">↑ 12% from last month</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">AI Handled</p>
                  <p className="text-3xl font-bold text-gray-900">124</p>
                  <p className="text-sm text-blue-600">79.5% success rate</p>
                </div>
                <Bot className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Human Handled</p>
                  <p className="text-3xl font-bold text-gray-900">32</p>
                  <p className="text-sm text-yellow-600">20.5% of total</p>
                </div>
                <UserCheck className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">89</p>
                  <p className="text-sm text-purple-600">57% conversion rate</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI vs Human Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">AI vs Human Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">AI Resolution Rate</span>
                    <span className="text-sm font-bold text-blue-600">79.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '79.5%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Human Resolution Rate</span>
                    <span className="text-sm font-bold text-green-600">95.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '95.2%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Response Time (AI)</span>
                    <span className="text-sm font-bold text-blue-600">2.3 sec</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Response Time (Human)</span>
                    <span className="text-sm font-bold text-green-600">45 sec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Progress Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Completed Treatments</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">67</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Ongoing Treatments</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">23</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Pending Appointments</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">15</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Follow-ups Due</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-gray-500">Total Interactions</div>
                <div className="text-xs text-green-500">↑ 18% vs last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">892</div>
                <div className="text-sm text-gray-500">Successful Appointments</div>
                <div className="text-xs text-green-500">↑ 24% vs last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                <div className="text-sm text-gray-500">Patient Satisfaction</div>
                <div className="text-xs text-green-500">↑ 0.3 vs last month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default AnalyticsDashboard;
