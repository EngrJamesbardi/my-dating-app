import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EditProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated!');
    } catch {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" className="w-full p-2 mb-4 border rounded" value={profile.name} onChange={handleChange} required />
        <input name="age" type="number" className="w-full p-2 mb-4 border rounded" value={profile.age} onChange={handleChange} required />
        <select name="gender" className="w-full p-2 mb-4 border rounded" value={profile.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <textarea name="bio" className="w-full p-2 mb-4 border rounded" value={profile.bio} onChange={handleChange} placeholder="Bio" />
        <input name="interests" type="text" className="w-full p-2 mb-4 border rounded" value={profile.interests} onChange={handleChange} placeholder="Interests (comma separated)" />
        {/* Add more fields as needed */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Changes</button>
      </form>
    </div>
  );
}
