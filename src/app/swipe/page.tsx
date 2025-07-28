import { useEffect, useState } from 'react';
import axios from 'axios';

interface MatchUser {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  distance: number;
}

export default function SwipePage() {
  const [users, setUsers] = useState<MatchUser[]>([]);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    axios.get('/api/matches', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load matches'));
  }, []);

  const handleSwipe = async (action: 'like' | 'pass') => {
    const token = localStorage.getItem('token');
    const user = users[current];
    if (!user) return;
    try {
      await axios.post('/api/swipe', { targetUserId: user.id, action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrent(c => c + 1);
    } catch {
      setError('Failed to swipe');
    }
  };

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (users.length === 0 || current >= users.length) return <div className="text-center mt-8">No more matches nearby.</div>;

  const user = users[current];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm mb-6 animate-fade-in">
        <img src={user.photos[0]} alt="Profile" className="w-full h-64 object-cover rounded mb-4" />
        <h2 className="text-xl font-bold mb-2">{user.name}, {user.age}</h2>
        <div className="mb-2 text-gray-600">{user.bio}</div>
        <div className="mb-2 text-sm text-gray-500">Distance: {user.distance.toFixed(1)} km</div>
      </div>
      <div className="flex gap-8 animate-swipe-buttons">
        <button onClick={() => handleSwipe('pass')} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full text-lg shadow hover:bg-gray-400 transition-transform duration-200 active:scale-90">Pass</button>
        <button onClick={() => handleSwipe('like')} className="bg-pink-500 text-white px-6 py-2 rounded-full text-lg shadow hover:bg-pink-600 transition-transform duration-200 active:scale-110">Like</button>
      </div>
    </div>
  );
}
