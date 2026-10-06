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
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed left-0 right-0 top-0 z-40 bg-card/95 shadow-sm backdrop-blur">
        <Header 
          variant="admin"
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          adminNavItems={filteredNavItems.map(({ label, path }) => ({ label, path }))}
        />
      </div>

      <div className="flex flex-1 pt-16 pb-16">
        <aside
          aria-label="Admin navigation"
          className={`fixed inset-y-16 left-0 z-30 w-72 transform border-r border-sidebar-border bg-sidebar shadow-lg backdrop-blur transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-3">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin</h3>
              <div className="space-y-1">
                {filteredNavItems.map(({ tab, label, icon: Icon, path }) => {
                  const isActive = activePath
                    ? activePath === path || activePath.startsWith(`${path}/`)
                    : activeTab === tab;
                  return (
                    <Button
                      key={tab}
                      variant="ghost"
                      className={`w-full justify-start gap-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 ${
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                      onClick={() => {
                        onTabChange?.(tab);
                        onNavigate?.(path, tab);
                        if (path) navigate(path);
                        setSidebarOpen(false);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-foreground">
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

        <main className="flex-1 overflow-auto px-4 pt-4 md:px-8 md:pt-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="space-y-1">
              {children}
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur">
        <Footer className="py-4 text-sm" />
      </div>
    </div>
  );
};
