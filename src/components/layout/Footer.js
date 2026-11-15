import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#0a0a0f',
        padding: '4rem 2rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🩰</span>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#fff' }}>DanceFlow Academy</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
            A unified Next.js + MongoDB dance ecosystem uniting world-class instruction, real-time timetable synchronization, live roll call, and fee administration.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
            Dance Categories
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem', color: '#94a3b8' }}>
            <span>Urban Hip-Hop & Breaking</span>
            <span>Classical Ballet & Pointe</span>
            <span>Contemporary Floorwork</span>
            <span>Salsa & Latin Ballroom</span>
            <span>Bharatanatyam Heritage</span>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
            Portals & Access
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
            <Link href="/courses" style={{ color: '#94a3b8' }}>Course Catalog</Link>
            <Link href="/login" style={{ color: '#94a3b8' }}>Dancer Portal</Link>
            <Link href="/login" style={{ color: '#94a3b8' }}>Faculty Instructor Login</Link>
            <Link href="/login" style={{ color: '#94a3b8' }}>Administration Office</Link>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
            Campus & Studios
          </h4>
          <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: '1.6' }}>
            Tandava Nritya Conservatory Campus<br />
            Phagwara, Punjab, India<br />
            Phone: +91 91777-0999<br />
            Email: contact@tandavanritya.academy
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: '#64748b',
        }}
      >
        © {new Date().getFullYear()} Tandava Nritya Academy. All rights reserved. Real-Time Cosmic Dance Conservatory.
      </div>
    </footer>
  );
}
