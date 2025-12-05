import { NavLink } from 'react-router-dom';
import { navLinks } from '../../constants/navLinks';
import { useAuth } from '../../hooks/useAuth';
import { Pill, User } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 hidden md:flex flex-col shadow-soft">
      <div className="px-6 py-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Pharmacy
            </p>
            <h1 className="text-xl font-bold text-slate-900 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Drug Manager
            </h1>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks
          .filter((link) => !link.roles || (role && link.roles.includes(role)))
          .map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''} group-hover:scale-110`} />
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-2 bg-primary-100 rounded-lg">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

