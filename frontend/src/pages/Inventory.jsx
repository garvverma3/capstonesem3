import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import {
  createDrug,
  deleteDrug,
  fetchDrugs,
} from '../services/drugService';
import { fetchSuppliers } from '../services/supplierService';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { Package, Plus, Search, Filter, Trash2, Calendar } from 'lucide-react';

const Inventory = () => {
  const [filters, setFilters] = useState({ search: '', status: '', category: '' });
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const canManage = user.role === ROLES.ADMIN;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      category: '',
      price: '',
      quantity: '',
      expiryDate: '',
      supplier: '',
      description: '',
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['drugs', filters],
    queryFn: () => fetchDrugs({ 
      search: filters.search, 
      status: filters.status,
      category: filters.category,
    }),
  });

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => fetchSuppliers({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createDrug,
    onSuccess: () => {
      queryClient.invalidateQueries(['drugs']);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDrug(id),
    onSuccess: () => queryClient.invalidateQueries(['drugs']),
  });

  const drugs = data?.data || [];
  const meta = data?.meta;

  const categories = useMemo(() => {
    return [...new Set(drugs.map((drug) => drug.category))];
  }, [drugs]);

  const columns = useMemo(
    () => [
      { 
        key: 'name', 
        label: 'Drug Name',
        render: (row) => (
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            {row.description && (
              <p className="text-xs text-slate-500 mt-0.5">{row.description.substring(0, 50)}...</p>
            )}
          </div>
        ),
      },
      { 
        key: 'category', 
        label: 'Category',
        render: (row) => (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
            {row.category}
          </span>
        ),
      },
      {
        key: 'price',
        label: 'Price',
        render: (row) => (
          <span className="font-semibold text-slate-900">${row.price.toFixed(2)}</span>
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
        key: 'expiryDate',
        label: 'Expiry',
        render: (row) => (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(row.expiryDate).toLocaleDateString()}
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => <StatusBadge status={row.status} />,
      },
      ...(canManage
        ? [
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                      deleteMutation.mutate(row._id);
                    }
                  }}
                  className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              ),
            },
          ]
        : []),
    ],
    [deleteMutation, canManage],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600 mt-1">Manage your pharmacy stock and medications</p>
        </div>
        {canManage && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Package className="w-5 h-5" />
            <span className="font-medium">{meta?.total ?? drugs.length} items</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft animate-slide-down">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  placeholder="Search by drug name..."
                  className="w-full pl-10 border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>
              <select
                className="border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="expired">Expired</option>
              </select>
              <select
                className="border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold">{meta?.total ?? drugs.length}</span> of{' '}
                <span className="font-semibold">{meta?.total ?? drugs.length}</span> drugs
              </p>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-soft">
              <div className="inline-block w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Loading inventory...</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <DataTable columns={columns} data={drugs} />
            </div>
          )}
        </div>

        {/* Add Drug Form */}
        {canManage && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-soft animate-slide-up sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Plus className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Drug</h3>
                <p className="text-sm text-slate-500">Track every item with supplier mapping</p>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit((values) =>
                createMutation.mutate({
                  ...values,
                  price: Number(values.price),
                  quantity: Number(values.quantity),
                }),
              )}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Drug Name *
                </label>
                <input
                  placeholder="e.g., Amoxicillin 500mg"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('name', { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category *
                </label>
                <input
                  placeholder="e.g., Antibiotic"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('category', { required: true })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    {...register('price', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Quantity *
                  </label>
                  <input
                    placeholder="0"
                    type="number"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    {...register('quantity', { required: true })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('expiryDate', { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier *
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('supplier', { required: true })}
                >
                  <option value="">Select supplier</option>
                  {suppliers?.data?.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name} - {supplier.company}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Additional notes..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                  rows={3}
                  {...register('description')}
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {createMutation.isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Drug
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
