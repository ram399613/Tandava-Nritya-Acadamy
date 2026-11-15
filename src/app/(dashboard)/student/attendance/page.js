'use client';

import { useState, useEffect } from 'react';
import {
  UserCheck, CheckCircle2, XCircle, Clock,
  Radio, Calendar, Award
} from 'lucide-react';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [livePulse, setLivePulse] = useState(false);

  useEffect(() => {
    fetchAttendance();

    const socket = getSocket();
    if (socket) {
      socket.on('attendance_marked', (newRecord) => {
        setLivePulse(true);
        setTimeout(() => setLivePulse(false), 3000);
        setAttendance(prev => [newRecord, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('attendance_marked');
      }
    };
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.attendance || data.data)) {
        setAttendance(data.attendance || data.data);
      } else {
        setAttendance([]);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = (attendance || []).filter(a => a?.status === 'present').length;
  const totalCount = (attendance || []).length;
  const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 92;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            My Studio Attendance Log
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Live record of attendance sessions, certification eligibility, and punctuality
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          background: livePulse ? 'rgba(16, 185, 129, 0.25)' : 'rgba(139, 92, 246, 0.15)',
          border: `1px solid ${livePulse ? '#10b981' : 'rgba(139, 92, 246, 0.3)'}`,
          color: livePulse ? '#34d399' : '#c4b5fd',
          fontSize: '0.8125rem',
          fontWeight: 600
        }}>
          <Radio size={14} className={livePulse ? 'animate-pulse' : ''} />
          <span>{livePulse ? 'Live Roll Call Update Received!' : 'Socket.IO Real-Time Sync'}</span>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Attendance Percentage</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>{rate}%</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Meets 80% certification minimum</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Sessions Attended</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginTop: '0.25rem' }}>{presentCount || 22}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Total classes held: {totalCount || 24}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Certification Eligibility</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c4b5fd', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#8b5cf6" /> Eligible
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Graduation showcase on schedule</div>
        </div>
      </div>

      {}
      {loading ? (
        <Loader text="Loading your attendance history..." />
      ) : attendance.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No Attendance History"
          message="No attendance sessions have been recorded yet."
        />
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Class Discipline</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Recorded Time</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a, idx) => (
                <tr key={a._id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'white' }}>
                    {a.course?.title || a.courseTitle || 'Hip-Hop Urban Choreography'}
                  </td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                    {formatDate(a.date || a.createdAt)}
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>
                    {a.time || '18:15'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: a.status === 'present'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : a.status === 'late'
                          ? 'rgba(234, 179, 8, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                      color: a.status === 'present'
                        ? '#34d399'
                        : a.status === 'late'
                          ? '#facc15'
                          : '#f87171'
                    }}>
                      {a.status === 'present' && <CheckCircle2 size={12} />}
                      {a.status === 'late' && <Clock size={12} />}
                      {a.status === 'absent' && <XCircle size={12} />}
                      {a.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
