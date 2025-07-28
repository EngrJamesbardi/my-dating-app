import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
}

interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data));
    axios.get('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data));
    axios.get('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAnalytics(res.data));
  }, []);

  const suspendUser = async (id: string) => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/admin/users/${id}/suspend`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users => users.map(u => u.id === id ? { ...u, verified: false } : u));
  };

  const deleteUser = async (id: string) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users => users.filter(u => u.id !== id));
  };

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Analytics</h3>
        <div>Users: {analytics.users}</div>
        <div>Matches: {analytics.matches}</div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">User Management</h3>
        <ul>
          {users.map(user => (
            <li key={user.id} className="mb-2 flex justify-between items-center">
              <span>{user.name} ({user.email}) {user.verified ? '' : '(Suspended)'}</span>
              <div>
                <button onClick={() => suspendUser(user.id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Suspend</button>
                <button onClick={() => deleteUser(user.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Reports</h3>
        <ul>
          {reports.map(report => (
            <li key={report.id} className="mb-2">
              <span>Reporter: {report.reporterId}, Reported: {report.reportedUserId}, Reason: {report.reason}, Date: {report.createdAt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
