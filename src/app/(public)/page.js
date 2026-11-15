'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, Shield, Star, Users, Calendar, Sparkles } from 'lucide-react';
import { DANCE_CATEGORIES } from '@/lib/utils';
import Loader from '@/components/common/Loader';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader text="Opening Tandava Nritya Sanctuary..." />
      </div>
    );
  }

  const dashboardHref = user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/student';
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {}
      <section
        style={{
          position: 'relative',
          padding: '6rem 2rem 5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '380px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(10, 10, 15, 0) 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />

        <h1
          className="nextjs-heading"
          style={{
            fontSize: 'clamp(2.75rem, 5.5vw, 4.6rem)',
            marginBottom: '1.5rem',
          }}
        >
          Elevate the Art of Movement <br />
          <span className="nextjs-gold-text">
            with Real-Time Intelligence
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          A unified sanctuary for students, faculty choreographers, and academy administrators.
          Schedule sessions with conflict prevention, log attendance in real-time via Socket.IO, and manage tuition fees seamlessly.
        </p>

        {}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/courses"
            className="btn btn-primary"
            style={{
              padding: '0.85rem 2.2rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            Explore 16 Academy Courses <ArrowRight size={18} />
          </Link>
          <Link
            href={dashboardHref}
            className="btn btn-secondary"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
            }}
          >
            Access My {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} Portal
          </Link>
        </div>

        {}
        <div
          style={{
            position: 'relative',
            maxWidth: '1020px',
            margin: '3.5rem auto 1rem',
            padding: '2rem',
            borderRadius: '24px',
            background: 'rgba(14, 12, 24, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(168, 85, 247, 0.25)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
          }}
        >
          {}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 12px #10b981',
                animation: 'pulse 1.8s infinite',
              }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.05em' }}>
                STUDIO CONSERVATORY LIVE STATUS
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div className="crazy-badge" style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}>
                🩰 Studio 1: Ballet Barre Active
              </div>
              <div className="crazy-badge" style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}>
                🔥 Studio 2: Hip-Hop Cypher
              </div>
              <div className="crazy-badge" style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}>
                ⚡ Socket.IO Connected
              </div>
            </div>
          </div>

          {}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            {}
            <div style={{ background: 'rgba(7, 6, 12, 0.6)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#c4b5fd', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Live Studio Acoustics & Rhythm Flow
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '56px', padding: '0.5rem 0' }}>
                {[35, 75, 45, 95, 60, 85, 40, 100, 65, 80, 50, 90, 70, 45, 88, 55, 92, 68, 84, 42].map((height, i) => (
                  <span
                    key={i}
                    style={{
                      flex: 1,
                      height: `${height}%`,
                      background: 'linear-gradient(to top, #8b5cf6, #ec4899, #f59e0b)',
                      borderRadius: '4px',
                      animation: `equalizerPulse 1.${(i % 5) + 2}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                <span>Tempo: 124 BPM</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Sync Rate: 0.12ms</span>
              </div>
            </div>

            {}
            <div style={{ background: 'rgba(7, 6, 12, 0.6)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Interactive Dance Rhythm Pads (Click to Play)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                {[
                  { name: 'Ghungroo Bell', icon: '🪔', freq: 880, decay: 0.15 },
                  { name: 'Hip-Hop 808', icon: '⚡', freq: 110, decay: 0.25 },
                  { name: 'Castanet Click', icon: '💃', freq: 1200, decay: 0.05 },
                  { name: 'Ballet Chime', icon: '🩰', freq: 660, decay: 0.2 },
                ].map((pad, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      try {
                        const AudioCtx = window.AudioContext || window.webkitAudioContext;
                        if (!AudioCtx) return;
                        const ctx = new AudioCtx();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.frequency.setValueAtTime(pad.freq, ctx.currentTime);
                        osc.frequency.exponentialRampToValueAtTime(pad.freq * 0.5, ctx.currentTime + pad.decay);
                        gain.gain.setValueAtTime(0.2, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + pad.decay);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + pad.decay);
                      } catch (_) {}
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '0.6rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                    className="interactive-ripple"
                  >
                    <span style={{ fontSize: '1.1rem' }}>{pad.icon}</span>
                    <span>{pad.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes equalizerPulse {
              0% { transform: scaleY(0.3); opacity: 0.6; }
              100% { transform: scaleY(1); opacity: 1; }
            }
          `}</style>
        </div>
      </section>

      {}
      <section style={{ maxWidth: '1240px', margin: '0 auto 5rem', padding: '0 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { label: 'Active Students Enrolled', value: '450+', icon: <Users color="#8b5cf6" size={24} /> },
            { label: 'Master Instructors', value: '18+', icon: <Star color="#f59e0b" size={24} /> },
            { label: 'Repertoire Courses', value: '32+', icon: <Calendar color="#3b82f6" size={24} /> },
            { label: 'Real-Time Sync Rate', value: '100%', icon: <CheckCircle color="#10b981" size={24} /> },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      <section style={{ maxWidth: '1280px', margin: '0 auto 6rem', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            Dance Disciplines
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            From high-energy urban battles and classical ballet pointe to traditional heritage forms.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {DANCE_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/courses?category=${cat.value}`}
              className="glass-card glass-card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                <img
                  src={cat.photo}
                  alt={cat.label}
                  className="course-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,12,24,0.95) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(14,12,24,0.75)', borderRadius: '8px', padding: '0.25rem 0.5rem', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  {cat.svgIcon ? (
                    <img src={cat.svgIcon} alt={cat.label} style={{ width: '20px', height: '20px' }} />
                  ) : null}
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                </div>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  {cat.label}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Master conservatory technique, performance choreography, and musicality with top faculty.
                </p>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: cat.color,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginTop: 'auto',
                  }}
                >
                  Explore Classes <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {}
      <section
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '5rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Engineered for Conservatory Performance
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Eliminating administrative friction with automated scheduling and real-time roll call.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <CheckCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Instant Socket.IO Attendance
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Instructors record students present, absent, or late in seconds. Student profiles and admin analytics update immediately without refreshing.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Conflict-Free Timetable
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Weekly studio scheduling engine automatically detects instructor and studio collisions before classes are saved into MongoDB.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Role-Based Guarded Routes
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Three distinct portals for Admins, Instructors, and Dancers protected with bcrypt password hashing and JWT authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section style={{ maxWidth: '1280px', margin: '5rem auto 0', padding: '0 2rem' }}>
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.08) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Ready to Begin Your Dance Journey?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 2rem' }}>
            Register your student account today, select your repertoire course, and get immediate enrollment confirmation.
          </p>
          <Link
            href="/register"
            className="btn btn-primary"
            style={{
              padding: '0.9rem 2.4rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            Create Dancer Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
