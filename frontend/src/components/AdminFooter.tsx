import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminFooterProps {
  handleLogout: () => void;
}

export const AdminFooter = ({ handleLogout }: AdminFooterProps) => {
  return (
    <div className="mt-auto w-full p-4 border-t border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700" 
        onClick={handleLogout}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>
    </div>
  );
};
