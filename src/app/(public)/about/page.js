import Link from 'next/link';
import { Award, Users, MapPin, Check, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
      {}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span
          style={{
            fontSize: '0.84rem',
            color: '#c4b5fd',
            background: 'rgba(139, 92, 246, 0.15)',
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            fontWeight: 600,
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          Our Heritage & Mission
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginTop: '1rem', letterSpacing: '-1px' }}>
          Where Passion Meets Discipline
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '1rem auto 0', lineHeight: 1.6 }}>
          Founded by international choreographers, DanceFlow Academy provides conservatory-level dance training alongside modern management infrastructure.
        </p>
      </div>

      {}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem',
        }}
      >
        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6',
              marginBottom: '1.5rem',
            }}
          >
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            Artistic Excellence
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Our faculty brings credentials from world-renowned companies, Bolshoi Ballet, Kalakshetra, Broadway ensembles, and world hip-hop championships.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              marginBottom: '1.5rem',
            }}
          >
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            Inclusive Community
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Whether taking your first beginner step or refining pointe technique for company auditions, every dancer thrives in a supportive, inspiring space.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              marginBottom: '1.5rem',
            }}
          >
            <MapPin size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            State-of-the-Art Studios
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Four purpose-built studios equipped with Harlequin sprung floors, full-length acoustic mirrors, surround sound, and atmospheric lighting.
          </p>
        </div>
      </div>

      {}
      <div
        className="glass-card"
        style={{
          padding: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Our Dance Studios
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Specially engineered spaces tailored to distinct styles to prevent injury and foster musicality.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Studio Nova (A) — 1,800 sq ft sprung wood floor for Hip-Hop & Freestyle',
              'Grand Hall (B) — 2,200 sq ft Harlequin marley with dual barres for Ballet',
              'Temple Studio (C) — Acoustically tuned hardwood for Classical & Bharatanatyam',
              'Salsa Lounge (D) — Club-style sound and mirrors for Latin partner work',
            ].map((facility, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                <Check color="#10b981" size={16} />
                {facility}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(26, 26, 46, 0.8) 100%)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Visit Our Campus
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Open Monday through Sunday for tours, trial sessions, and faculty meets.
          </p>
          <Link href="/courses" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Explore Classes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
