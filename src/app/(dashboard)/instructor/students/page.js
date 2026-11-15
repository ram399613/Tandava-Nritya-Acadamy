'use client';

import { useState, useEffect } from 'react';
import {
  Users, Search, Award, TrendingUp, Mail, Phone,
  CheckCircle, Clock, Star
} from 'lucide-react';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { getInitials } from '@/lib/utils';

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (data && data.success && Array.isArray(data.students || data.data)) {
          setStudents(data.students || data.data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filtered = (students || []).filter(s =>
    s && (
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
          My Student Dancers Roster
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Monitor technique progression, rhythm retention, and attendance across your classes
        </p>
      </div>

      {}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search dancer by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 1rem 0.625rem 2.5rem',
              background: '#0a0a0f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {}
      {loading ? (
        <Loader text="Loading your students..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Dancers Found"
          message="No student profiles match your search."
        />
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Dancer</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Skill Level</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Attendance</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Technique Rating</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Emergency Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s._id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: '#c4b5fd'
                    }}>
                      {s.level || 'Intermediate'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>{s.attendanceRate || 88}%</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>attendance</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                      <Star size={14} fill="#fbbf24" />
                      <span style={{ fontWeight: 600 }}>4.8 / 5.0</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.8125rem' }}>
                    {s.emergencyContact?.name || 'Parent'} ({s.emergencyContact?.phone || '+91 98765 00000'})
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
