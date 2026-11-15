'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Calendar, Clock, Award, CheckCircle2,
  CreditCard, ArrowRight, Radio, Bell
} from 'lucide-react';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [livePulse, setLivePulse] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, nRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/notifications')
        ]);
        const cData = await cRes.json();
        const nData = await nRes.json();
        if (cData.success) setCourses(cData.courses.slice(0, 2));
        if (nData.success) setNotifications(nData.notifications.slice(0, 3));
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const socket = getSocket();
    if (socket) {
      socket.on('attendance_marked', () => {
        setLivePulse(true);
        setTimeout(() => setLivePulse(false), 3000);
      });
      socket.on('announcement_received', (notice) => {
        setNotifications(prev => [notice, ...prev.slice(0, 2)]);
      });
    }

    return () => {
      if (socket) {
        socket.off('attendance_marked');
        socket.off('announcement_received');
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '1rem',
        padding: '2rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span style={{
            padding: '0.25rem 0.75rem',
            background: 'rgba(139, 92, 246, 0.3)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#c4b5fd',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Academy Dancer Portal
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            Hello, {user?.name || 'Dancer'}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.6 }}>
            Your next choreography session is today at 6:00 PM in Studio 1. Your overall attendance is in good standing!
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/student/timetable">
              <Button variant="primary" icon={Calendar}>
                View My Studio Timetable
              </Button>
            </Link>
            <Link href="/student/attendance">
              <Button variant="outline" icon={CheckCircle2}>
                My Attendance Log
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {livePulse && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.875rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          borderRadius: '0.5rem',
          color: '#34d399',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          <Radio size={16} className="animate-pulse" />
          <span>Live roll call recorded for your class session by your instructor!</span>
        </div>
      )}

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Active Enrollments</span>
            <BookOpen size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginTop: '0.5rem' }}>2 Courses</div>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '0.25rem' }}>Hip-Hop & Contemporary</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Attendance Rate</span>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>92%</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Eligible for certification</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Next Studio Class</span>
            <Clock size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.5rem' }}>6:00 PM Today</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Studio 1 (Main Hall)</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Tuition Status</span>
            <CreditCard size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.5rem' }}>PAID</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>All dues cleared</div>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>My Current Courses</h2>
            <Link href="/student/courses" style={{ color: '#8b5cf6', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
              Browse Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.map((c, idx) => (
              <div
                key={c._id || idx}
                style={{
                  background: '#0a0a0f',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.6875rem', padding: '0.15rem 0.5rem', background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', borderRadius: '0.25rem' }}>
                    {c.category}
                  </span>
                  <div style={{ fontWeight: 600, color: 'white', marginTop: '0.375rem', fontSize: '0.925rem' }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {c.studioRoom || 'Studio 1'} • {c.scheduleTime || '6:00 PM'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>Academy Announcements</h2>
            <Bell size={16} color="#8b5cf6" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n, idx) => (
              <div
                key={n._id || idx}
                style={{
                  background: '#0a0a0f',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderLeft: '3px solid #8b5cf6'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{n.title}</div>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>{formatDate(n.createdAt)}</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.8125rem', marginTop: '0.375rem', lineHeight: 1.5 }}>
                  {n.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
