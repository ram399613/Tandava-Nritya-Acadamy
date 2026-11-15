export default function EmptyState({ icon = '🩰', title = 'No Data Found', message = 'There are no items recorded yet.' }) {
  return (
    <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>{message}</p>
    </div>
  );
}
