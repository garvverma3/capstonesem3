import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { fetchOrders, createOrder, updateOrderStatus } from '../services/orderService';
import { fetchDrugs } from '../services/drugService';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { ShoppingCart, Plus, Filter, Calendar, User, Package, CheckCircle, XCircle, Clock } from 'lucide-react';

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => fetchOrders({ status: statusFilter }),
  });

  const { data: drugs } = useQuery({
    queryKey: ['drugs', 'for-orders'],
    queryFn: () => fetchDrugs({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      reset();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(['orders']),
  });

  const canManageStatus = user.role === ROLES.ADMIN || user.role === ROLES.PHARMACIST;
  const orders = data?.data || [];
  const meta = data?.meta;

  const statusCounts = {
    pending: orders.filter((o) => o.status === 'pending').length,
    fulfilled: orders.filter((o) => o.status === 'fulfilled').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium">{meta?.total ?? orders.length} orders</span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-soft card-hover animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 mb-1 font-semibold">Pending</p>
              <p className="text-3xl font-bold text-amber-900">{statusCounts.pending}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl shadow-sm">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-soft card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1 font-semibold">Fulfilled</p>
              <p className="text-3xl font-bold text-green-900">{statusCounts.fulfilled}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl shadow-sm">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-5 shadow-soft card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-700 mb-1 font-semibold">Cancelled</p>
              <p className="text-3xl font-bold text-rose-900">{statusCounts.cancelled}</p>
            </div>
            <div className="p-3 bg-rose-100 rounded-xl shadow-sm">
              <ShoppingCart className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft animate-slide-down">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          </div>
          <select
            className="border border-slate-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="ml-auto text-sm text-slate-600">
            Total: <span className="font-semibold">{meta?.total ?? orders.length}</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-soft">
          <div className="inline-block w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading orders...</p>
        </div>
      ) : (
        <div className="animate-fade-in">
        <DataTable
          columns={[
            {
              key: 'drug',
              label: 'Drug',
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.drug?.name || '—'}</p>
                  <p className="text-xs text-slate-500">${row.drug?.price?.toFixed(2) || '0.00'} each</p>
                </div>
              ),
            },
            { 
              key: 'customerName', 
              label: 'Customer',
              render: (row) => (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{row.customerName}</span>
                </div>
              ),
            },
            { 
              key: 'quantity', 
              label: 'Quantity',
              render: (row) => (
                <span className="font-bold text-slate-900 text-base">{row.quantity}</span>
              ),
            },
            {
              key: 'total',
              label: 'Total',
              render: (row) => {
                const total = (row.drug?.price || 0) * row.quantity;
                return (
                  <span className="font-semibold text-slate-900">${total.toFixed(2)}</span>
                );
              },
            },
            {
              key: 'orderDate',
              label: 'Date',
              render: (row) => (
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(row.orderDate || row.createdAt).toLocaleDateString()}
                </div>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => {
                // Check if user can update this order
                // Admins can update any order, pharmacists can only update their own orders
                const pharmacistId = row.pharmacist?._id || row.pharmacist;
                const userId = user._id || user.id;
                const canUpdate = canManageStatus && (
                  user.role === ROLES.ADMIN || 
                  (user.role === ROLES.PHARMACIST && pharmacistId && String(pharmacistId) === String(userId))
                );
                
                return (
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={row.status} />
                    {canUpdate && row.status === 'pending' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: row._id,
                              status: 'fulfilled',
                            })
                          }
                          disabled={updateStatusMutation.isLoading}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                          title="Mark as Fulfilled"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Fulfill
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: row._id,
                              status: 'cancelled',
                            })
                          }
                          disabled={updateStatusMutation.isLoading}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                          title="Cancel Order"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    )}
                    {canUpdate && row.status !== 'pending' && (
                      <select
                        className="text-xs border border-slate-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none bg-white hover:border-primary-300 transition-colors"
                        value={row.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: row._id,
                            status: e.target.value,
                          })
                        }
                        disabled={updateStatusMutation.isLoading}
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                );
              },
            },
            {
              key: 'pharmacist',
              label: 'Pharmacist',
              render: (row) => (
                <span className="text-slate-600 text-sm">{row.pharmacist?.name || '—'}</span>
              ),
            },
          ]}
          data={orders}
          emptyMessage="No orders yet"
        />
        </div>
      )}

      {/* Create Order Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Plus className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create New Order</h3>
            <p className="text-sm text-slate-500">Process a new customer order</p>
          </div>
        </div>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit((values) =>
            createMutation.mutate({
              ...values,
              quantity: Number(values.quantity),
            }),
          )}
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Drug *
            </label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              {...register('drug', { required: true })}
            >
              <option value="">Select drug</option>
              {drugs?.data?.map((drug) => (
                <option key={drug._id} value={drug._id}>
                  {drug.name} - Stock: {drug.quantity} - ${drug.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Quantity *
            </label>
            <input
              placeholder="Enter quantity"
              type="number"
              min="1"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              {...register('quantity', { required: true, min: 1 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Customer Name *
            </label>
            <input
              placeholder="Enter customer name"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              {...register('customerName', { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Order Date
            </label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              {...register('orderDate')}
            />
          </div>
          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Order
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Orders;
