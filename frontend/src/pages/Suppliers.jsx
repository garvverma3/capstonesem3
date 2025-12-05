import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable from '../components/common/DataTable';
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
} from '../services/supplierService';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { Users, Plus, Search, Trash2, Mail, Phone, Building, MapPin } from 'lucide-react';

const Suppliers = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { user } = useAuth();
  const canManage = user.role === ROLES.ADMIN;

  const { data, isLoading } = useQuery({
    queryKey: ['suppliers', search],
    queryFn: () => fetchSuppliers({ search }),
  });

  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSupplier(id),
    onSuccess: () => queryClient.invalidateQueries(['suppliers']),
  });

  const suppliers = data?.data || [];
  const meta = data?.meta;

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

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft animate-slide-down">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            placeholder="Search suppliers by name, company, or email..."
            className="w-full pl-10 border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{suppliers.length}</span> of{' '}
            <span className="font-semibold">{meta?.total ?? suppliers.length}</span> suppliers
          </p>
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
              label: 'Contact Person',
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{row.company}</p>
                </div>
              ),
            },
            {
              key: 'company',
              label: 'Company',
              render: (row) => (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{row.company}</span>
                </div>
              ),
            },
            {
              key: 'contactEmail',
              label: 'Email',
              render: (row) => (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a
                    href={`mailto:${row.contactEmail}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    {row.contactEmail}
                  </a>
                </div>
              ),
            },
            {
              key: 'contactPhone',
              label: 'Phone',
              render: (row) => (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a
                    href={`tel:${row.contactPhone}`}
                    className="text-slate-700 hover:text-primary-600 text-sm"
                  >
                    {row.contactPhone}
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
                    <span className="text-sm text-slate-600">{row.address}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">—</span>
                )
              ),
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
                        Delete
                      </button>
                    ),
                  },
                ]
              : []),
          ]}
          data={suppliers}
          emptyMessage="No suppliers yet"
        />
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contact Person *
              </label>
              <input
                placeholder="Full name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('name', { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Company Name *
              </label>
              <input
                placeholder="Company name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('company', { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email *
              </label>
              <input
                placeholder="contact@company.com"
                type="email"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('contactEmail', { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone
              </label>
              <input
                placeholder="+1-555-123-4567"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('contactPhone')}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Address
              </label>
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
