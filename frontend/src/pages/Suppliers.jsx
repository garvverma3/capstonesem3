import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable from '../components/common/DataTable';
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier,
} from '../services/supplierService';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { Users, Plus, Search, Trash2, Mail, Phone, MapPin, Edit2, X, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const Suppliers = () => {
  const [search, setSearch] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  // Form for editing matches the create form structure
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit }
  } = useForm();

  const { user } = useAuth();
  const canManage = user.role === ROLES.ADMIN || user.role === ROLES.PHARMACIST;

  const { data, isLoading } = useQuery({
    queryKey: ['suppliers', search, page, sortBy],
    queryFn: () => fetchSuppliers({ search, page, limit, sort: sortBy }),
  });

  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      reset();
    },
    onError: (error) => {
      alert(`Error creating supplier: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      setEditingSupplier(null);
      resetEdit();
    },
    onError: (error) => {
      alert(`Error updating supplier: ${error.response?.data?.message || error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSupplier(id),
    onSuccess: () => queryClient.invalidateQueries(['suppliers']),
    onError: (error) => {
      alert(`Error deleting supplier: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleEditClick = (supplier) => {
    setEditingSupplier(supplier);
    setValueEdit('name', supplier.name);
    setValueEdit('email', supplier.email);
    setValueEdit('phone', supplier.phone);
    setValueEdit('address', supplier.address);
  };

  const suppliers = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supplier Management</h1>
          <p className="text-slate-600 mt-1">Manage your pharmacy suppliers and contacts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="w-5 h-5" />
          <span className="font-medium">{meta?.total ?? suppliers.length} suppliers</span>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft animate-slide-down">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="Search suppliers by name or email..."
              className="w-full pl-10 border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              className="border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Newest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="email">Email (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-soft">
          <div className="inline-block w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading suppliers...</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Supplier Name',
                render: (row) => (
                  <div className="font-semibold text-slate-900">{row.name}</div>
                ),
              },
              {
                key: 'email',
                label: 'Email',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${row.email}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {row.email}
                    </a>
                  </div>
                ),
              },
              {
                key: 'phone',
                label: 'Phone',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <a href={`tel:${row.phone}`} className="text-slate-700 hover:text-primary-600 text-sm">
                      {row.phone}
                    </a>
                  </div>
                ),
              },
              {
                key: 'address',
                label: 'Address',
                render: (row) => (
                  row.address ? (
                    <div className="flex items-start gap-2 max-w-xs">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600 truncate">{row.address}</span>
                    </div>
                  ) : <span className="text-slate-400 text-sm">—</span>
                ),
              },
              ...(canManage ? [{
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Supplier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                          deleteMutation.mutate(row.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Supplier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              }] : []),
            ]}
            data={suppliers}
            emptyMessage="No suppliers found"
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-4">
              <div className="text-sm text-slate-600">
                Page {page} of {totalPages} • Showing {suppliers.length} of {meta.total} suppliers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg font-medium text-sm">
                  {page}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Supplier</h3>
              <button
                onClick={() => setEditingSupplier(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={handleSubmitEdit((data) => updateMutation.mutate({ id: editingSupplier.id, data }))}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name *</label>
                <input
                  {...registerEdit('name', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {errorsEdit.name && <span className="text-xs text-rose-500">{errorsEdit.name.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...registerEdit('email', { required: 'Email is required' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {errorsEdit.email && <span className="text-xs text-rose-500">{errorsEdit.email.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  {...registerEdit('phone', { required: 'Phone is required' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {errorsEdit.phone && <span className="text-xs text-rose-500">{errorsEdit.phone.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  {...registerEdit('address')}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-70"
                >
                  {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Form */}
      {canManage && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Plus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add New Supplier</h3>
              <p className="text-sm text-slate-500">Register a new supplier contact</p>
            </div>
          </div>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Supplier Name *</label>
              <input
                placeholder="Company Name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input
                placeholder="contact@company.com"
                type="email"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
              <input
                placeholder="+1-555-123-4567"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('phone', { required: 'Phone is required' })}
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <textarea
                placeholder="Full address"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                rows={2}
                {...register('address')}
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
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Supplier
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
