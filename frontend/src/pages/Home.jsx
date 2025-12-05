import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { fetchDrugs } from '../services/drugService';
import { fetchOrders } from '../services/orderService';
import { fetchSuppliers } from '../services/supplierService';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  DollarSign
} from 'lucide-react';

const Home = () => {
  const { data: drugsData, isLoading: drugsLoading } = useQuery({
    queryKey: ['drugs', 'overview'],
    queryFn: () => fetchDrugs({ limit: 10 }),
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'overview'],
    queryFn: () => fetchOrders({ limit: 10 }),
  });

  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers', 'overview'],
    queryFn: () => fetchSuppliers({ limit: 100 }),
  });

  const drugs = drugsData?.data || [];
  const orders = ordersData?.data || [];
  const suppliers = suppliersData?.data || [];

  const lowStockCount = drugs.filter((drug) => drug.status === 'low-stock').length;
  const outOfStockCount = drugs.filter((drug) => drug.status === 'out-of-stock').length;
  const expiredCount = drugs.filter((drug) => drug.status === 'expired').length;
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  
  const totalRevenue = orders
    .filter((order) => order.status === 'fulfilled')
    .reduce((sum, order) => {
      const drugPrice = order.drug?.price || 0;
      return sum + drugPrice * order.quantity;
    }, 0);

  const stats = [
    {
      label: 'Total Drugs',
      value: drugsData?.meta?.total ?? drugs.length,
      trend: `${lowStockCount} low stock`,
      icon: Package,
    },
    {
      label: 'Suppliers',
      value: suppliersData?.meta?.total ?? suppliers.length,
      trend: 'Active partners',
      icon: Users,
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      trend: 'Awaiting fulfilment',
      icon: ShoppingCart,
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      trend: 'This month',
      icon: DollarSign,
    },
  ];

  const alerts = [
    ...(lowStockCount > 0 ? [{ type: 'low-stock', count: lowStockCount, label: 'Low Stock Items' }] : []),
    ...(outOfStockCount > 0 ? [{ type: 'out-of-stock', count: outOfStockCount, label: 'Out of Stock' }] : []),
    ...(expiredCount > 0 ? [{ type: 'expired', count: expiredCount, label: 'Expired Items' }] : []),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-xl p-8 text-white shadow-strong relative overflow-hidden animate-slide-down">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Pharmacy Dashboard</h1>
          <p className="text-primary-100 text-lg">Welcome back! Here's an overview of your pharmacy operations.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.label} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-up">
            <StatCard {...stat} />
          </div>
        ))}
      </section>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-soft animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-amber-900 text-lg">Inventory Alerts</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {alerts.map((alert) => (
              <div key={alert.type} className="bg-white rounded-lg px-4 py-2.5 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-200">
                <span className="text-sm font-semibold text-amber-900">
                  {alert.count} {alert.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-6 card-hover animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Inventory Alerts</h3>
              <p className="text-sm text-slate-500">Latest stock updates</p>
            </div>
            <Link
              to="/inventory"
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 group transition-all duration-200"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {drugsLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 mt-2">Loading...</p>
            </div>
          ) : (
            <DataTable
              columns={[
                { key: 'name', label: 'Drug' },
                { key: 'category', label: 'Category' },
                {
                  key: 'quantity',
                  label: 'Quantity',
                  render: (row) => (
                    <span className="font-semibold text-slate-900">{row.quantity}</span>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => <StatusBadge status={row.status} />,
                },
              ]}
              data={drugs.slice(0, 5)}
              emptyMessage="No inventory records yet"
            />
          )}
        </div>

        {/* Latest Orders */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-6 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Latest Orders</h3>
              <p className="text-sm text-slate-500">Recent transactions</p>
            </div>
            <Link
              to="/orders"
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 group transition-all duration-200"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 mt-2">Loading...</p>
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  key: 'drug',
                  label: 'Drug',
                  render: (row) => (
                    <span className="font-medium text-slate-900">
                      {row.drug?.name || '—'}
                    </span>
                  ),
                },
                { 
                  key: 'customerName', 
                  label: 'Customer',
                  render: (row) => (
                    <span className="text-slate-700">{row.customerName}</span>
                  ),
                },
                {
                  key: 'quantity',
                  label: 'Qty',
                  render: (row) => (
                    <span className="font-semibold text-slate-900">{row.quantity}</span>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => <StatusBadge status={row.status} />,
                },
              ]}
              data={orders.slice(0, 5)}
              emptyMessage="No orders yet"
            />
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-5 shadow-soft card-hover animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">Total Categories</p>
              <p className="text-2xl font-bold text-slate-900">
                {new Set(drugs.map((d) => d.category)).size}
              </p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-5 shadow-soft card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">Fulfilled Orders</p>
              <p className="text-2xl font-bold text-slate-900">
                {orders.filter((o) => o.status === 'fulfilled').length}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-5 shadow-soft card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-900">
                ${orders.length > 0 
                  ? (totalRevenue / orders.filter((o) => o.status === 'fulfilled').length || 1).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
