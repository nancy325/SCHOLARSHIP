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
  ChevronRight,
  School,
  Plus,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';

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
      icon: Users,
      description: 'Registered accounts',
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Active Scholarships',
      value: dashboardStats.active_scholarships?.toLocaleString() || '0',
      icon: GraduationCap,
      description: 'With a current deadline',
      color: 'bg-secondary/25 text-foreground'
    },
    {
      title: 'Institutes',
      value: dashboardStats.total_institutes?.toLocaleString() || '0',
      icon: Building2,
      description: 'Registered institutions',
      color: 'bg-accent text-accent-foreground'
    },
    {
      title: 'Universities',
      value: dashboardStats.total_universities?.toLocaleString() || '0',
      icon: School,
      description: 'Registered universities',
      color: 'bg-muted text-foreground'
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
          <Card className="overflow-hidden border border-border shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-md p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border border-border shadow-sm">
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
                  <div key={item.created_at || `${item.type}-${index}`} className="group flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'user' ? 'bg-primary' :
                      item.type === 'institute' ? 'bg-secondary' :
                      item.type === 'scholarship' ? 'bg-accent-foreground' : 'bg-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
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
          <Button variant="ghost" onClick={() => onQuickNav('/admin-dashboard/analytics', 'analytics')} className="mt-4 w-full text-primary hover:bg-primary/5">
            View all activity
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="group h-11 w-full justify-start border-border hover:border-primary/30 hover:bg-primary/5" 
              onClick={() => onQuickNav('/admin-dashboard/users/create', 'users')}
            >
              <div className="mr-3 rounded-md bg-primary/10 p-1.5 group-hover:bg-primary/15">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              Add New User
            </Button>
            <Button 
              variant="outline" 
              className="group h-11 w-full justify-start border-border hover:border-secondary/50 hover:bg-secondary/10" 
              onClick={() => onQuickNav('/admin-dashboard/institutes/create', 'institutes')}
            >
              <div className="mr-3 rounded-md bg-secondary/25 p-1.5 group-hover:bg-secondary/35">
                <Plus className="h-4 w-4 text-foreground" />
              </div>
              Register Institute
            </Button>
            <Button 
              variant="outline" 
              className="group h-11 w-full justify-start border-border hover:border-accent/80 hover:bg-accent" 
              onClick={() => onQuickNav('/admin-dashboard/scholarships/create', 'scholarships')}
            >
              <div className="mr-3 rounded-md bg-accent p-1.5 group-hover:bg-accent/80">
                <Plus className="h-4 w-4 text-accent-foreground" />
              </div>
              Create Scholarship
            </Button>
            <Button 
              variant="outline" 
              className="group h-11 w-full justify-start border-border hover:border-muted-foreground/30 hover:bg-muted" 
              onClick={() => onQuickNav('/admin-dashboard/analytics', 'analytics')}
            >
              <div className="mr-3 rounded-md bg-muted p-1.5 group-hover:bg-muted/80">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
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

const editFields: Record<string, Array<{ name: string; label: string; type?: string; required?: boolean; options?: string[] }>> = {
  User: [
    { name: 'name', label: 'Full name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: ['student', 'institute_admin', 'university_admin', 'admin'], required: true },
    { name: 'category', label: 'Education category' },
    { name: 'RecStatus', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
  ],
  Institute: [
    { name: 'name', label: 'Institute name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' },
    { name: 'website', label: 'Website', type: 'url' },
    { name: 'address', label: 'Address' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  Scholarship: [
    { name: 'title', label: 'Scholarship title', required: true },
    { name: 'type', label: 'Provider type', type: 'select', options: ['government', 'private', 'university', 'institute'], required: true },
    { name: 'deadline', label: 'Deadline', type: 'date' },
    { name: 'apply_link', label: 'Application link', type: 'url' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
  ],
};

const EntityForm = ({ entity, mode }: FormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = mode === 'edit';
  const fields = editFields[entity] ?? [];
  const section = entity === 'Institute' ? 'institutes' : `${entity.toLowerCase()}s`;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !id) return;
    let mounted = true;

    const loadEntity = async () => {
      setLoading(true);
      setError(null);
      try {
        const entityId = Number(id);
        const response = entity === 'User'
          ? await apiService.getUser(entityId)
          : entity === 'Institute'
            ? await apiService.getInstitute(entityId)
            : await apiService.getScholarship(entityId);
        if (!response.success) throw new Error(response.message || `Could not load ${entity.toLowerCase()}.`);
        const record = (response.data as any)?.data ?? response.data ?? {};
        if (mounted) {
          setFormData(Object.fromEntries(fields.map((field) => {
            const value = String(record[field.name] ?? '');
            return [field.name, field.type === 'date' ? value.slice(0, 10) : value];
          })));
        }
      } catch (loadError: any) {
        if (mounted) setError(loadError?.message || `Could not load ${entity.toLowerCase()}.`);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadEntity();
    return () => { mounted = false; };
  }, [entity, fields, id, isEdit]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id || !isEdit) return;
    setSaving(true);
    setError(null);
    try {
      const payload = Object.fromEntries(Object.entries(formData).filter(([, value]) => value !== ''));
      const entityId = Number(id);
      const response = entity === 'User'
        ? await apiService.updateUser(entityId, payload)
        : entity === 'Institute'
          ? await apiService.updateInstitute(entityId, payload)
          : await apiService.updateScholarship(entityId, payload);
      if (!response.success) throw new Error(response.message || `Could not save ${entity.toLowerCase()}.`);
      toast({ title: 'Changes saved', description: `${entity} details were updated.` });
      navigate(`/admin-dashboard/${section}`);
    } catch (saveError: any) {
      setError(saveError?.response?.data?.message || saveError?.message || `Could not save ${entity.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p role="status" className="py-12 text-center text-sm text-muted-foreground">Loading {entity.toLowerCase()}…</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="border border-border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            {isEdit ? <Pencil className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
            {isEdit ? `Edit ${entity}` : `Create ${entity}`}
          </CardTitle>
          <CardDescription>
            {isEdit ? `Update ${entity.toLowerCase()} details using the connected service.` : `Add a new ${entity.toLowerCase()}`}
          </CardDescription>
          {isEdit && id && <p className="text-xs text-gray-500">Editing ID: {id}</p>}
        </CardHeader>
        <CardContent>
          {error && <div role="alert" className="mb-5 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                  <label className="text-sm font-medium text-foreground" htmlFor={`${entity}-${field.name}`}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea id={`${entity}-${field.name}`} value={formData[field.name] ?? ''} onChange={(event) => setFormData((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  ) : field.type === 'select' ? (
                    <select id={`${entity}-${field.name}`} value={formData[field.name] ?? ''} onChange={(event) => setFormData((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options?.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
                    </select>
                  ) : (
                    <Input id={`${entity}-${field.name}`} type={field.type ?? 'text'} value={formData[field.name] ?? ''} onChange={(event) => setFormData((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <Button type="submit" disabled={saving || !isEdit}>{saving ? 'Saving…' : 'Save changes'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/admin-dashboard/${section}`)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SettingsCard = () => {
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('scholarsnap:reduce-motion') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    localStorage.setItem('scholarsnap:reduce-motion', String(reduceMotion));
  }, [reduceMotion]);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Display preferences</CardTitle>
        <CardDescription>Accessibility preferences are saved in this browser.</CardDescription>
      </CardHeader>
      <CardContent>
        <label className="flex cursor-pointer items-start justify-between gap-5 rounded-md border border-border p-4">
          <span>
            <span className="block font-medium text-foreground">Reduce motion</span>
            <span className="mt-1 block text-sm text-muted-foreground">Limit interface animations and transitions.</span>
          </span>
          <input
            type="checkbox"
            checked={reduceMotion}
            onChange={(event) => setReduceMotion(event.target.checked)}
            className="mt-1 h-4 w-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;