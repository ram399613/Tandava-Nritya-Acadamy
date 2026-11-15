'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, ArrowRight, LogOut, Bell, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getDashboardHref = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'instructor') return '/instructor';
    return '/student';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="crazy-floating-nav-wrapper">
      <header className="crazy-floating-navbar">
        {}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="crazy-logo-box">
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.45)',
              }}
            >
              🔥
            </div>
          </div>
          <div>
            <div className="cosmic-shimmer-text" style={{ fontWeight: '900', fontSize: '1.28rem', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
              Tandava Nritya
            </div>
            <div style={{ fontSize: '0.68rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1.6px', fontWeight: 800 }}>
              Cosmic Academy
            </div>
          </div>
        </Link>

        {}
        <div className="nav-dock-capsule">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`crazy-nav-link ${isActive ? 'active' : ''}`}
                >
                  {isActive && <span className="pulsing-ember-dot" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link
                href={getDashboardHref()}
                className="crazy-enroll-btn"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.86rem' }}
              >
                <User size={15} /> Dashboard <ArrowRight size={15} />
              </Link>
              <button
                onClick={logout}
                className="btn btn-secondary ripple-click-btn"
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                href="/login"
                className="crazy-nav-link"
                style={{ fontSize: '0.88rem', fontWeight: 700 }}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="crazy-enroll-btn"
              >
                <Sparkles size={14} /> Enroll Now
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
