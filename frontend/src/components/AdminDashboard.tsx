import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  Home,
  TrendingUp,
  ChevronRight,
  School,
  Plus,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import UserManagement from './admin/UserManagement';
import InstituteManagement from './admin/InstituteManagement';
import ScholarshipManagement from './admin/ScholarshipManagement';
import Analytics from './admin/Analytics';
// Removed: import AdminApiTest from './AdminApiTest';
import { AdminLayout } from './layout/AdminLayout';
import UniversityManagement from './admin/UniversityManagement';
import CreateUniversity from '@/pages/CreateUniversity';
import CreateScholarship from '@/pages/CreateScholarship';
import CreateUser from '@/pages/CreateUser';
import CreateInstitute from '@/pages/CreateInstitute';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = useMemo(() => [
    { label: 'Overview', icon: Home, tab: 'overview', path: '/admin-dashboard' },
    { label: 'User Management', icon: Users, tab: 'users', path: '/admin-dashboard/users' },
    { label: 'Institute Management', icon: Building2, tab: 'institutes', path: '/admin-dashboard/institutes' },
    { label: 'University Management', icon: School, tab: 'universities', path: '/admin-dashboard/universities' },
    { label: 'Scholarship Management', icon: GraduationCap, tab: 'scholarships', path: '/admin-dashboard/scholarships' },
    { label: 'Analytics', icon: BarChart3, tab: 'analytics', path: '/admin-dashboard/analytics' },
    // Removed: { label: 'API Test', icon: Activity, tab: 'api-test', path: '/admin-dashboard/api-test' },
    { label: 'Settings', icon: Settings, tab: 'settings', path: '/admin-dashboard/settings' }
  ], []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, activityResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getRecentActivity()
        ]);

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }

        if (activityResponse.success) {
          setRecentActivity(activityResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout API fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/');
      navigate('/');
    }
  };

  const stats = dashboardStats ? [
    {
      title: 'Total Users',
      value: dashboardStats.total_users?.toLocaleString() || '0',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      description: 'Active users this month',
      color: 'bg-blue-100 text-blue-600'
    },
    // {
    //   title: 'Registered Institutes',
    //   value: dashboardStats.total_institutes?.toLocaleString() || '0',
    //   change: '+8%',
    //   changeType: 'positive',
    //   icon: Building2,
    //   description: 'Partner institutions',
    //   color: 'bg-green-100 text-green-600'
    // },
    {
      title: 'Active Scholarships',
      value: dashboardStats.active_scholarships?.toLocaleString() || '0',
      change: '+23%',
      changeType: 'positive',
      icon: GraduationCap,
      description: 'Available opportunities',
      color: 'bg-purple-100 text-purple-600'
    }
  ] : [];

  useEffect(() => {
    const match = navItems
      .filter((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
      .sort((a, b) => b.path.length - a.path.length)[0];
    setActiveTab(match?.tab || 'overview');
  }, [location.pathname, navItems]);

  const handleTabChange = (tab: string) => {
    const target = navItems.find((item) => item.tab === tab);
    if (target) {
      setActiveTab(tab);
      navigate(target.path);
    }
  };

  const activeNav = navItems.find(nav => nav.tab === activeTab);

  const handleNavigate = (path: string, tab: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <AdminLayout 
      title={activeNav?.label || 'Dashboard'}
      description={
        activeTab === 'overview' 
          ? 'Welcome to your admin dashboard. Monitor and manage your scholarship portal.'
          : `Manage ${activeNav?.label.toLowerCase()}`
      }
      activeTab={activeTab}
      activePath={location.pathname}
      onTabChange={handleTabChange}
      onNavigate={handleNavigate}
      navItems={navItems}
    >
      <Routes>
        <Route 
          index 
          element={
            <OverviewSection 
              stats={stats}
              loading={loading}
              recentActivity={recentActivity}
              onQuickNav={handleNavigate}
            />
          } 
        />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="users/:id/edit" element={<EntityForm entity="User" mode="edit" />} />

        <Route path="institutes" element={<InstituteManagement />} />
        <Route path="institutes/create" element={<CreateInstitute />} />
        <Route path="institutes/:id/edit" element={<EntityForm entity="Institute" mode="edit" />} />

        <Route path="scholarships" element={<ScholarshipManagement />} />
        <Route path="scholarships/create" element={<CreateScholarship />} />
        <Route path="scholarships/:id/edit" element={<EntityForm entity="Scholarship" mode="edit" />} />

        <Route path="universities" element={<UniversityManagement />} />
        <Route path="universities/create" element={<CreateUniversity />} />
        <Route path="analytics" element={<Analytics />} />
        {/* Removed: <Route path="api-test" element={<AdminApiTest />} /> */}
        <Route path="settings" element={<SettingsCard />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </AdminLayout>
  );
};

type OverviewProps = {
  stats: any[];
  loading: boolean;
  recentActivity: any[];
  onQuickNav: (path: string, tab: string) => void;
};

const OverviewSection = ({ stats, loading, recentActivity, onQuickNav }: OverviewProps) => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.25 }}
        >
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
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
              <div className="text-xs text-gray-500 mt-1">
                {stat.description}
              </div>
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
        </motion.div>
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
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">Loading recent activity...</div>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.slice(0, 4).map((item, index) => (
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
              ))
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">No recent activity</div>
              </div>
            )}
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
              onClick={() => onQuickNav('/admin-dashboard/users/create', 'users')}
            >
              <div className="rounded-full bg-blue-100 p-1.5 mr-3 group-hover:bg-blue-200">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              Add New User
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-11 border-gray-200 hover:border-green-200 hover:bg-green-50 group" 
              onClick={() => onQuickNav('/admin-dashboard/institutes/create', 'institutes')}
            >
              <div className="rounded-full bg-green-100 p-1.5 mr-3 group-hover:bg-green-200">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              Register Institute
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-11 border-gray-200 hover:border-purple-200 hover:bg-purple-50 group" 
              onClick={() => onQuickNav('/admin-dashboard/scholarships/create', 'scholarships')}
            >
              <div className="rounded-full bg-purple-100 p-1.5 mr-3 group-hover:bg-purple-200">
                <Plus className="h-4 w-4 text-purple-600" />
              </div>
              Create Scholarship
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-11 border-gray-200 hover:border-amber-200 hover:bg-amber-50 group" 
              onClick={() => onQuickNav('/admin-dashboard/analytics', 'analytics')}
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

type FormProps = {
  entity: string;
  mode: 'create' | 'edit';
};

const EntityForm = ({ entity, mode }: FormProps) => {
  const { id } = useParams();
  const isEdit = mode === 'edit';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-0 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            {isEdit ? <Pencil className="h-4 w-4 text-indigo-600" /> : <Plus className="h-4 w-4 text-indigo-600" />}
            {isEdit ? `Edit ${entity}` : `Create ${entity}`}
          </CardTitle>
          <CardDescription>
            {isEdit ? `Update ${entity.toLowerCase()} details` : `Add a new ${entity.toLowerCase()}`}
          </CardDescription>
          {isEdit && id && <p className="text-xs text-gray-500">Editing ID: {id}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor={`${entity}-name`}>Name</label>
              <Input id={`${entity}-name`} placeholder={`${entity} name`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor={`${entity}-code`}>Code / Identifier</label>
              <Input id={`${entity}-code`} placeholder="e.g. SCH-2024-01" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor={`${entity}-notes`}>Notes</label>
            <textarea
              id={`${entity}-notes`}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={`Describe this ${entity.toLowerCase()}...`}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit">{isEdit ? 'Save changes' : 'Create'}</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SettingsCard = () => (
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

export default AdminDashboard;