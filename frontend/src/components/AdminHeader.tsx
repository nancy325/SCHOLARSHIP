import { Menu, X, Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminHeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  showSidebarToggle?: boolean;
}

export const AdminHeader = ({ 
  sidebarOpen = false, 
  setSidebarOpen = () => {},
  showSidebarToggle = true 
}: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {showSidebarToggle && (
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      )}
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        
        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
};
