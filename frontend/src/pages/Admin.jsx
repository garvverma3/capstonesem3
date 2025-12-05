import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable from '../components/common/DataTable';
import { fetchUsers, updateUserRole } from '../services/userService';
import { ROLES } from '../constants/roles';

const Admin = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">User management</h3>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          {
            key: 'role',
            label: 'Role',
            render: (row) => (
              <select
                value={row.role}
                onChange={(e) =>
                  mutation.mutate({ id: row._id, role: e.target.value })
                }
                className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
              >
                {Object.values(ROLES).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            ),
          },
        ]}
        data={data?.data || []}
        emptyMessage="No users yet"
      />
    </div>
  );
};

export default Admin;


