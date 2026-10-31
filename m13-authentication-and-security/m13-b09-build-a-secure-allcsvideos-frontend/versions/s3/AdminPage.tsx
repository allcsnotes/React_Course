import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUsers, setRole } from './api.ts'
import type { Role } from './schema.ts'

const ROLES: Role[] = ['student', 'instructor', 'admin']

export default function AdminPage() {
  const queryClient = useQueryClient()
  const users = useQuery({ queryKey: ['users'], queryFn: getUsers })
  const change = useMutation({
    mutationFn: ({ id, role }: { id: number; role: Role }) => setRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  if (users.isPending) return <p className="note">Loading users...</p>
  if (users.error) return <p className="bad">{users.error.message}</p>
  return (
    <>
      <h1>All users</h1>
      <table className="users">
        <tbody>
          {users.data.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    change.mutate({ id: u.id, role: e.target.value as Role })
                  }
                >
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
