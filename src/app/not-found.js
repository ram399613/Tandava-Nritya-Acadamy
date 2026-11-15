import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🩰</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '450px', margin: '0.8rem 0 2rem' }}>
        The dance studio or routine you are looking for has moved or does not exist.
      </p>
      <Link href="/" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
        Return to Home
      </Link>
    </div>
  );
}
