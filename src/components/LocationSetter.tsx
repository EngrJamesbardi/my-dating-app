import { getCurrentLocation } from '../utils/geolocation';
import { useEffect, useState } from 'react';

export default function LocationSetter() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentLocation()
      .then(loc => setLocation(loc))
      .catch(err => setError(err));
  }, []);

  return (
    <div>
      {location ? (
        <div>Location: {location.lat}, {location.lng}</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>Getting location...</div>
      )}
    </div>
  );
}
