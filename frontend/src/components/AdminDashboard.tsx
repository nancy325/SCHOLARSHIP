import React, { useState } from 'react';
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
  Activity
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      description: 'Active users this month'
    },
    {
      title: 'Registered Institutes',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Building2,
      description: 'Partner institutions'
    },
    {
      title: 'Active Scholarships',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: GraduationCap,
      description: 'Available opportunities'
    },
    {
      title: 'Applications',
      value: '1,234',
      change: '+18%',
      changeType: 'positive',
      icon: Activity,
      description: 'This month'
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
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <div className="flex items-center pt-2">
                      <Badge variant={stat.changeType === 'positive' ? 'default' : 'destructive'}>
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                      { action: 'Institute profile updated', time: '15 minutes ago', type: 'institute' },
                      { action: 'New scholarship added', time: '1 hour ago', type: 'scholarship' },
                      { action: 'Application submitted', time: '2 hours ago', type: 'application' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'user' ? 'bg-blue-500' :
                          item.type === 'institute' ? 'bg-green-500' :
                          item.type === 'scholarship' ? 'bg-purple-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('users')}>
                      <Users className="mr-2 h-4 w-4" />
                      Add New User
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('institutes')}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Register Institute
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('scholarships')}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Create Scholarship
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('analytics')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
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
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Administrative settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings configuration will be implemented here.</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Button
                  variant={activeTab === item.tab ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${
                    activeTab === item.tab ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium">Admin User</span>
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
