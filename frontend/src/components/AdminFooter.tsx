import { Copyright } from 'lucide-react';

interface AdminFooterProps {
  className?: string;
}

export const AdminFooter = ({ className = '' }: AdminFooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`border-t border-gray-200 bg-gradient-to-r from-white to-gray-50 py-4 px-6 ${className}`}>
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <div className="flex items-center text-sm text-gray-600">
          <Copyright className="mr-1 h-4 w-4" />
          <span>{currentYear} Scholarship. All rights reserved.</span>
        </div>
        <div className="mt-2 text-sm text-gray-500 md:mt-0">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
};
