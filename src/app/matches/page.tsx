import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Match {
  id: string;
  userA: string;
  userB: string;
  score: number;
  createdAt: string;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    axios.get('/api/matches', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMatches(res.data.filter((m: Match) => m.userA === userId || m.userB === userId)))
      .catch(() => setError('Failed to load matches'));
  }, [userId]);

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (matches.length === 0) return <div className="text-center mt-8">No matches yet.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Matches</h2>
      <ul>
        {matches.map(match => (
          <li key={match.id} className="mb-4 flex justify-between items-center">
            <span>Match Score: {match.score}</span>
            <Link href={`/chat/${match.id}`} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Chat</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
