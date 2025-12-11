import { ComponentType, ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, School, Users, Settings, Home } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import { Button } from '../ui/button';
import { apiService } from '@/services/api';

type NavItem = {
  tab: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
  roles?: string[];
};

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  activeTab?: string;
  activePath?: string;
  onTabChange?: (tab: string) => void;
  onNavigate?: (path: string, tab: string) => void;
  navItems?: NavItem[];
}

export const AdminLayout = ({ 
  children, 
  title = 'Dashboard',
  description = 'Admin panel',
  activeTab,
  activePath,
  onTabChange,
  onNavigate,
  navItems: navItemsProp
}: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const role = useMemo(() => {
    try {
      return apiService.getStoredUser()?.role || 'admin';
    } catch (e) {
      return 'admin';
    }
  }, []);

  const fallbackNavItems: NavItem[] = [
    { tab: 'overview', label: 'Overview', icon: Home, path: '/admin-dashboard', roles: ['admin', 'manager', 'editor'] },
    { tab: 'scholarships', label: 'Scholarship Management', icon: GraduationCap, path: '/admin-dashboard/scholarships', roles: ['admin', 'manager', 'editor'] },
    { tab: 'institutes', label: 'Institute Management', icon: Building2, path: '/admin-dashboard/institutes', roles: ['admin', 'manager'] },
    { tab: 'universities', label: 'University Management', icon: School, path: '/admin-dashboard/universities', roles: ['admin', 'manager'] },
    { tab: 'users', label: 'User Management', icon: Users, path: '/admin-dashboard/users', roles: ['admin'] },
    { tab: 'settings', label: 'Settings', icon: Settings, path: '/admin-dashboard/settings', roles: ['admin', 'manager', 'editor'] },
  ];

  const navItems = navItemsProp ?? fallbackNavItems;

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/60 text-slate-900">
      <div className="fixed top-0 left-0 right-0 z-40 shadow-sm bg-white/90 backdrop-blur">
        <Header 
          variant="admin"
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <div className="flex flex-1 pt-16 pb-16">
        <aside
          aria-label="Admin navigation"
          className={`fixed inset-y-16 left-0 z-30 w-72 bg-white/95 backdrop-blur border-r border-gray-100 shadow-lg transform transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Admin</h3>
              <div className="space-y-1">
                {filteredNavItems.map(({ tab, label, icon: Icon, path }) => {
                  const isActive = activePath
                    ? activePath === path || activePath.startsWith(`${path}/`)
                    : activeTab === tab;
                  return (
                    <Button
                      key={tab}
                      variant="ghost"
                      className={`w-full justify-start gap-3 text-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-[0_4px_12px_rgba(59,130,246,0.12)]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        onTabChange?.(tab);
                        onNavigate?.(path, tab);
                        if (path) navigate(path);
                        setSidebarOpen(false);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            className="fixed inset-0 z-20 bg-slate-900/30 backdrop-blur-sm md:hidden"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto md:ml-0 pt-4 md:pt-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {description && (
                <p className="text-gray-600">{description}</p>
              )}
            </div>
            <div className="space-y-1">
              {children}
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 backdrop-blur">
        <Footer className="py-4 text-sm" />
      </div>
    </div>
  );
};
