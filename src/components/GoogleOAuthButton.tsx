import { useEffect } from 'react';

export default function GoogleOAuthButton() {
  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogle = (response: any) => {
    // Send Google token to backend
    fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = '/profile';
      });
  };

  useEffect(() => {
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogle
      });
      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

  return <div id="google-signin" className="my-4 flex justify-center" />;
}
