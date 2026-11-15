'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, User, CheckCircle2 
} from 'lucide-react';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { DAYS_OF_WEEK } from '@/lib/utils';

export default function StudentTimetablePage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('All');

  useEffect(() => {
    async function fetchTimetable() {
      try {
        const res = await fetch('/api/timetable');
        const data = await res.json();
        if (data && data.success && Array.isArray(data.sessions || data.data)) {
          setSessions(data.sessions || data.data);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTimetable();
  }, []);

  const filtered = (sessions || []).filter(s => s && (selectedDay === 'All' || s.dayOfWeek === selectedDay));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div>
        <div className="crazy-badge" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
          <span>🩰</span> Live Conservatory Timetable
        </div>
        <h1 className="nextjs-heading" style={{ fontSize: '2.1rem', marginBottom: '0.25rem' }}>
          My Weekly Studio Schedule
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
          Real-time schedule for your dance sessions, stage rehearsals, and conservatory workshops
        </p>
      </div>

      {}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setSelectedDay('All')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: selectedDay === 'All' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
            color: selectedDay === 'All' ? 'white' : '#94a3b8'
          }}
        >
          All Days
        </button>
        {DAYS_OF_WEEK.map(day => {
          const name = typeof day === 'object' ? (day.label || day.value) : day;
          return (
            <button
              key={name}
              onClick={() => setSelectedDay(name)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: selectedDay === name ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                color: selectedDay === name ? 'white' : '#94a3b8'
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      {}
      {loading ? (
        <Loader text="Loading your studio timetable..." />
      ) : filtered.length === 0 ? (
        <EmptyState 
          icon={Calendar}
          title="No Classes Scheduled"
          message={`You have no classes scheduled on ${selectedDay === 'All' ? 'this week' : selectedDay}.`}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((s, idx) => (
            <div 
              key={s._id || idx}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c4b5fd'
                }}>
                  {s.dayOfWeek}
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={13} /> {s.startTime} - {s.endTime}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>
                  {s.course?.title || s.courseTitle || 'Urban Choreography'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#94a3b8', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  <User size={14} color="#8b5cf6" />
                  <span>{s.instructor?.name || s.instructorName || 'Master Choreographer'}</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: '#0a0a0f',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                color: '#cbd5e1'
              }}>
                <MapPin size={14} color="#ec4899" />
                <span>{s.studioRoom || 'Studio 1 (Main Hall)'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
