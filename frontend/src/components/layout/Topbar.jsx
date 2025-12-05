import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Bell, User } from 'lucide-react';

const pageTitles = {
  '/': 'Overview',
  '/inventory': 'Inventory',
  '/suppliers': 'Suppliers',
  '/orders': 'Orders',
  '/admin': 'Admin Dashboard',
};

const Topbar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="animate-slide-down">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">
          Stay on top of pharmacy operations
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 uppercase">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;


