import { useEffect } from 'react';
import { BOOKING_HASH_HREF } from '../config/site';

/** SPA route `/book` — short link for QR; redirects to home contact section. */
const BookRedirect = () => {
  useEffect(() => {
    window.location.replace(BOOKING_HASH_HREF);
  }, []);

  return (
    <div
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '2rem',
        textAlign: 'center',
        color: '#1E293B',
      }}
    >
      <p>Taking you to contact…</p>
    </div>
  );
};

export default BookRedirect;
