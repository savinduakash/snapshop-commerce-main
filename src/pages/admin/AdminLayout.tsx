import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, FolderOpen, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: FolderOpen, path: '/admin/categories' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <h1 className="font-display text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">Your account does not have admin privileges.</p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r bg-card md:block">
        <div className="p-6">
          <Link to="/" className="font-display text-lg font-bold">Store Admin</Link>
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-3">
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => supabase.auth.signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-2 border-b p-4 md:hidden">
          <Link to="/" className="font-display text-lg font-bold">Admin</Link>
          <div className="ml-auto flex gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant={location.pathname === item.path ? 'secondary' : 'ghost'} size="icon">
                  <item.icon className="h-4 w-4" />
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="icon" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
