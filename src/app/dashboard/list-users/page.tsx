"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  role: string;
  created_at: string;
};

export default function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://127.0.0.1:8000/users");
        if (!res.ok) {
          throw new Error(`Backend error: ${res.status}`);
        }
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return <p className="p-4">Loading users...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">List Users</h1>
      <p className="mb-6">Manage and view all system users.</p>

      <table className="w-full border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border border-gray-600 px-4 py-2">ID</th>
            <th className="border border-gray-600 px-4 py-2">Username</th>
            <th className="border border-gray-600 px-4 py-2">Role</th>
            <th className="border border-gray-600 px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center hover:bg-gray-700">
              <td className="border border-gray-600 px-4 py-2">{user.id}</td>
              <td className="border border-gray-600 px-4 py-2">
                {user.username}
              </td>
              <td className="border border-gray-600 px-4 py-2">{user.role}</td>
              <td className="border border-gray-600 px-4 py-2">
                {new Date(user.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
