import Sidebar from '@/components/layout/Sidebar';

export default function InstructorLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      <Sidebar role="instructor" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: '260px' }}>
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            background: 'rgba(8, 6, 14, 0.12)',
            backdropFilter: 'blur(20px) saturate(190%)',
            WebkitBackdropFilter: 'blur(20px) saturate(190%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.10)',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.84rem', color: '#94a3b8', fontWeight: 600 }}>
              Faculty Live Sync Online
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#c4b5fd', fontWeight: 600 }}>
            Faculty Portal
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem 2.5rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
