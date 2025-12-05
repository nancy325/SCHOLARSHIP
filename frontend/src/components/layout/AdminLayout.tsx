import { ReactNode, useState } from 'react';
import { AdminHeader } from '../AdminHeader';
import { AdminFooter } from '../AdminFooter';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export const AdminLayout = ({ 
  children, 
  title = 'Dashboard',
  description = 'Admin panel'
}: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <AdminHeader 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          {children}
        </div>
      </main>
      
      <AdminFooter />
    </div>
  );
};
