import { TrendingUp, TrendingDown, Package, Users, ShoppingCart, AlertCircle } from 'lucide-react';

const iconMap = {
  'Total Drugs': Package,
  'Suppliers': Users,
  'Pending Orders': ShoppingCart,
  'Low Stock Items': AlertCircle,
};

const StatCard = ({ label, value, trend, icon }) => {
  const Icon = icon || iconMap[label] || Package;
  const isPositive = trend && !trend.toLowerCase().includes('low') && !trend.toLowerCase().includes('awaiting');

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 border border-slate-200 shadow-soft hover:shadow-medium transition-all duration-300 card-hover group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? 'text-success' : 'text-warning'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        {value}
      </p>
      {trend && (
        <p className={`text-xs font-semibold ${
          isPositive ? 'text-success' : 'text-warning'
        }`}>
          {trend}
        </p>
      )}
    </div>
  );
};

export default StatCard;
