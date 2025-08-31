import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  UserCheck,
  TrendingUp,
  Activity,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from './admin/UserManagement';
import InstituteManagement from './admin/InstituteManagement';
import ScholarshipManagement from './admin/ScholarshipManagement';
import Analytics from './admin/Analytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logging out...');
    // Typically: clear auth tokens, redirect to login, etc.
    localStorage.removeItem('authToken'); // example

    // Redirect to landing page
    navigate('/');
  };

  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      description: 'Active users this month',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Registered Institutes',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Building2,
      description: 'Partner institutions',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Active Scholarships',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: GraduationCap,
      description: 'Available opportunities',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Applications',
      value: '1,234',
      change: '+18%',
      changeType: 'positive',
      icon: Activity,
      description: 'This month',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const navigation = [
    { name: 'Overview', icon: Home, tab: 'overview' },
    { name: 'User Management', icon: Users, tab: 'users' },
    { name: 'Institute Management', icon: Building2, tab: 'institutes' },
    { name: 'Scholarship Management', icon: GraduationCap, tab: 'scholarships' },
    { name: 'Analytics', icon: BarChart3, tab: 'analytics' },
    { name: 'Settings', icon: Settings, tab: 'settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                    <div className="flex items-center pt-3">
                      <Badge 
                        variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                        className={stat.changeType === 'positive' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                      >
                        {stat.changeType === 'positive' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : null}
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Latest actions in the system</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {[
                      { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                      { action: 'Institute profile updated', time: '15 minutes ago', type: 'institute' },
                      { action: 'New scholarship added', time: '1 hour ago', type: 'scholarship' },
                      { action: 'Application submitted', time: '2 hours ago', type: 'application' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 group">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.type === 'user' ? 'bg-blue-500' :
                            item.type === 'institute' ? 'bg-green-500' :
                            item.type === 'scholarship' ? 'bg-purple-500' : 'bg-amber-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.action}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View all activity
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-11 border-gray-200 hover:border-blue-200 hover:bg-blue-50 group" 
                      onClick={() => setActiveTab('users')}
                    >
                      <div className="rounded-full bg-blue-100 p-1.5 mr-3 group-hover:bg-blue-200">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      Add New User
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-11 border-gray-200 hover:border-green-200 hover:bg-green-50 group" 
                      onClick={() => setActiveTab('institutes')}
                    >
                      <div className="rounded-full bg-green-100 p-1.5 mr-3 group-hover:bg-green-200">
                        <Building2 className="h-4 w-4 text-green-600" />
                      </div>
                      Register Institute
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-11 border-gray-200 hover:border-purple-200 hover:bg-purple-50 group" 
                      onClick={() => setActiveTab('scholarships')}
                    >
                      <div className="rounded-full bg-purple-100 p-1.5 mr-3 group-hover:bg-purple-200">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                      </div>
                      Create Scholarship
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-11 border-gray-200 hover:border-amber-200 hover:bg-amber-50 group" 
                      onClick={() => setActiveTab('analytics')}
                    >
                      <div className="rounded-full bg-amber-100 p-1.5 mr-3 group-hover:bg-amber-200">
                        <BarChart3 className="h-4 w-4 text-amber-600" />
                      </div>
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'institutes':
        return <InstituteManagement />;
      case 'scholarships':
        return <ScholarshipManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Administrative settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Settings configuration will be implemented here.</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">ScholarAdmin</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Button
                  variant={activeTab === item.tab ? 'secondary' : 'ghost'}
                  className={`w-full justify-start transition-all ${
                    activeTab === item.tab 
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab(item.tab)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 lg:px-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-green-50 rounded-full py-1 px-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">System Online</span>
              </div>
              <Separator orientation="vertical" className="h-6 bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  AU
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {navigation.find(nav => nav.tab === activeTab)?.name || 'Dashboard'}
            </h2>
            <p className="text-gray-600 mt-1">
              {activeTab === 'overview' 
                ? 'Welcome to your admin dashboard. Monitor and manage your scholarship portal.'
                : `Manage ${navigation.find(nav => nav.tab === activeTab)?.name.toLowerCase()}`
              }
            </p>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;