import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="mb-2"><strong>Name:</strong> {profile.name}</div>
      <div className="mb-2"><strong>Email:</strong> {profile.email}</div>
      <div className="mb-2"><strong>Age:</strong> {profile.age}</div>
      <div className="mb-2"><strong>Gender:</strong> {profile.gender}</div>
      <div className="mb-2"><strong>Bio:</strong> {profile.bio}</div>
      <div className="mb-2"><strong>Interests:</strong> {profile.interests?.join(', ')}</div>
      <div className="mb-2"><strong>Verified:</strong> {profile.verified ? 'Yes' : 'No'}</div>
      <div className="mb-2"><strong>Location:</strong> {profile.location?.city}, {profile.location?.country}</div>
      <div className="mb-2"><strong>Photos:</strong> {profile.photos?.map((url: string, i: number) => (
        <img key={i} src={url} alt="Profile" className="inline-block h-16 w-16 rounded mr-2" />
      ))}</div>
      <div className="mb-2"><strong>Privacy:</strong> {JSON.stringify(profile.privacy)}</div>
      <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Edit Profile</button>
    </div>
  );
}
