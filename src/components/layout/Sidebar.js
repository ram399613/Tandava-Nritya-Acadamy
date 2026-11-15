'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckSquare,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Clock,
  User,
} from 'lucide-react';

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const adminLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Instructors', href: '/admin/instructors', icon: GraduationCap },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
    { label: 'Enrollments', href: '/admin/enrollments', icon: CheckSquare },
    { label: 'Timetable', href: '/admin/timetable', icon: Calendar },
    { label: 'Attendance', href: '/admin/attendance', icon: Clock },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const instructorLinks = [
    { label: 'Dashboard', href: '/instructor', icon: LayoutDashboard },
    { label: 'My Classes', href: '/instructor/classes', icon: BookOpen },
    { label: 'My Students', href: '/instructor/students', icon: Users },
    { label: 'Mark Attendance', href: '/instructor/attendance', icon: CheckSquare },
    { label: 'Timetable', href: '/instructor/timetable', icon: Calendar },
  ];

  const studentLinks = [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'Browse Courses', href: '/student/courses', icon: BookOpen },
    { label: 'My Enrollments', href: '/student/enrollments', icon: CheckSquare },
    { label: 'My Timetable', href: '/student/timetable', icon: Calendar },
    { label: 'My Attendance', href: '/student/attendance', icon: Clock },
    { label: 'My Payments', href: '/student/payments', icon: CreditCard },
  ];

  const links = role === 'admin' ? adminLinks : role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <aside
      className="crazy-sidebar"
      style={{
        width: '260px',
        background: 'rgba(8, 6, 14, 0.15)',
        backdropFilter: 'blur(22px) saturate(190%)',
        WebkitBackdropFilter: 'blur(22px) saturate(190%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: '4px 0 35px rgba(0, 0, 0, 0.25), inset -1px 0 0 rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 100,
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {}
      <div style={{ padding: '1.35rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="crazy-logo-box">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              }}
            >
              🔥
            </div>
          </div>
          <div>
            <div className="cosmic-shimmer-text" style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              Tandava Nritya
            </div>
            <div style={{ fontSize: '0.68rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 800 }}>
              {role} Portal
            </div>
          </div>
        </Link>
      </div>

      {}
      <nav style={{ padding: '1.25rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`crazy-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <div className="icon-box">
                <Icon size={18} color={isActive ? '#fbbf24' : '#94a3b8'} />
              </div>
              <span style={{ flex: 1 }}>{link.label}</span>
              {isActive && <span className="pulsing-ember-dot" />}
            </Link>
          );
        })}
      </nav>

      {}
      <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || `${user?.firstName || 'User'} ${user?.lastName || ''}`}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                {user?.role || role}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
            }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
