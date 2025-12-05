import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { fetchOrders, createOrder, updateOrderStatus, deleteOrder } from '../services/orderService';
import { fetchDrugs } from '../services/drugService';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { ShoppingCart, Plus, Filter, Calendar, User, Package, CheckCircle, XCircle, Trash2, Edit2, X } from 'lucide-react';

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Edit form
  // Note: For MVP we might just support updating status via the table, 
  // but if we want to edit items we'd need a similar form. 
  // For now let's focus on adding DELETE and improving the create flow.

  const { user } = useAuth();
  const canManage = user.role === ROLES.ADMIN || user.role === ROLES.PHARMACIST;

  const { data, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => fetchOrders({ status: statusFilter }),
  });

  const { data: drugs } = useQuery({
    queryKey: ['drugs', 'for-orders'],
    queryFn: () => fetchDrugs({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      reset();
    },
    onError: (error) => {
      alert(`Error creating order: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(['orders']),
    onError: (error) => {
      alert(`Error updating status: ${error.response?.data?.message || error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteOrder(id),
    onSuccess: () => queryClient.invalidateQueries(['orders']),
    onError: (error) => {
      alert(`Error deleting order: ${error.response?.data?.message || error.message}`);
    }
  });

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
                render: (row) => {
                  // Handle different structure from backend (Prisma includes items array or simple fields)
                  // Assuming current backend implementation returns basic fields or items
                  const itemName = row.items && row.items.length > 0 ? row.items[0].drug?.name : (row.drug?.name);
                  const itemPrice = row.items && row.items.length > 0 ? row.items[0].price : (row.drug?.price);
                  return (
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{itemName || 'Batch Order'}</p>
                      <p className="text-xs text-slate-500">
                        {row.items?.length > 1 ? `${row.items.length} items` : `$${itemPrice?.toFixed(2) || '0.00'} each`}
                      </p>
                    </div>
                  );
                },
              },
              {
                key: 'user',
                label: 'Customer',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 text-sm">{row.user?.name || row.customerName || 'Unknown'}</span>
                  </div>
                ),
              },
              {
                key: 'totalAmount',
                label: 'Total',
                render: (row) => (
                  <span className="font-bold text-slate-900 text-sm">${row.totalAmount?.toFixed(2) || '0.00'}</span>
                ),
              },
              {
                key: 'createdAt',
                label: 'Date',
                render: (row) => (
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(row.createdAt).toLocaleDateString()}
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => {
                  const canUpdate = canManage; // Simplified permission check for now

                  return (
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={row.status} />
                      {canUpdate && row.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'fulfilled' })}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Fulfill Order"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'cancelled' })}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                },
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    {/* For MVP we only allow delete, edit is complex with order items */}
                    {canManage && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this order?')) {
                            deleteMutation.mutate(row.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            data={orders}
            emptyMessage="No orders found"
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
              // Backend expects drugId or similar depending on implementation
              // drug field from select will be string ID
            }),
          )}
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Drug *
            </label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              {...register('drugId', { required: 'Please select a drug' })}
            >
              <option value="">Select drug</option>
              {drugs?.data?.map((drug) => (
                <option key={`drug-${drug.id}`} value={drug.id}>
                  {drug.name} - Stock: {drug.quantity} - ${drug.price.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.drugId && <p className="text-xs text-rose-500 mt-1">{errors.drugId.message}</p>}
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
              {...register('quantity', { required: 'Quantity is required', min: 1 })}
            />
            {errors.quantity && <p className="text-xs text-rose-500 mt-1">{errors.quantity.message}</p>}
          </div>
          // Note: Backend creates order for logged in user usually, or takes a userId.
          // If this is an admin placing order for a customer, we ideally need a User select or name input if guest checkout.
          // For now assuming we just pass customer name for display or record if schema supports it, 
          // OR we assign to the current user (pharmacist) if they are placing it.
          // The previous code had customerName input. Let's keep it but backend might ignore it if not in schema.
          {/* 
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Customer Name (Optional)
            </label>
            <input
              placeholder="Enter customer name"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              {...register('customerName')}
            />
          </div>
          */}

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
