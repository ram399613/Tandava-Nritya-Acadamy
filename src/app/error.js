'use client';

export default function Error({ error, reset }) {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
        An Unexpected Error Occurred
      </h2>
      <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
        {error?.message || 'Something went wrong while rendering this page.'}
      </p>
      <button
        onClick={() => reset()}
        className="btn btn-primary"
        style={{ padding: '0.75rem 1.75rem' }}
      >
        Try Again
      </button>
    </div>
  );
}
