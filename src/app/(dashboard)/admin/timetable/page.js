'use client';

import { useState, useEffect } from 'react';
import {
  Calendar, Clock, Plus, MapPin, User, AlertTriangle,
  Trash2, Filter, CheckCircle2
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { DAYS_OF_WEEK } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

export default function AdminTimetablePage() {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflictError, setConflictError] = useState('');

  const [formData, setFormData] = useState({
    courseId: '',
    instructorId: '',
    studioRoom: 'Studio 1 (Main Hall)',
    dayOfWeek: 'Monday',
    startTime: '18:00',
    endTime: '19:30'
  });

  useEffect(() => {
    fetchTimetable();
    fetchOptions();

    const socket = getSocket();
    if (socket) {
      socket.on('timetable_updated', (updatedSessions) => {
        setSessions(updatedSessions);
      });
    }

    return () => {
      if (socket) {
        socket.off('timetable_updated');
      }
    };
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await fetch('/api/timetable');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.sessions || data.data)) {
        setSessions(data.sessions || data.data);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('Failed to load timetable:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [cRes, iRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/instructors')
      ]);
      const cData = await cRes.json();
      const iData = await iRes.json();
      if (cData.success) setCourses(cData.courses);
      if (iData.success) {
        setInstructors(iData.instructors);
        if (iData.instructors.length > 0) {
          setFormData(prev => ({
            ...prev,
            instructorId: iData.instructors[0]._id,
            courseId: cData.courses?.[0]?._id || ''
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load options:', err);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setConflictError('');

    try {
      const res = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setConflictError(data.error || 'Schedule collision detected for this room or instructor.');
        return;
      }

      setIsModalOpen(false);
      fetchTimetable();
    } catch (err) {
      setConflictError('Network or server error while checking schedule conflict.');
    }
  };

  const filteredSessions = (sessions || []).filter(s => {
    if (!s) return false;
    return selectedDay === 'All' || s.dayOfWeek === selectedDay;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="crazy-badge" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
            <span>⚡</span> Automated Room Overlap & Double-Booking Protection
          </div>
          <h1 className="nextjs-heading" style={{ fontSize: '2.1rem', marginBottom: '0.25rem' }}>
            Weekly Studio Timetable & Conflict Engine
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
            Live scheduling across Studios 1–5 with automated conflict detection & real-time booking updates
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setConflictError('');
            setIsModalOpen(true);
          }}
        >
          Schedule Studio Class
        </Button>
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
            color: selectedDay === 'All' ? 'white' : '#94a3b8',
            transition: 'all 0.2s'
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
                color: selectedDay === name ? 'white' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      {}
      {loading ? (
        <Loader text="Analyzing timetable and bookings..." />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Sessions Scheduled"
          message={`No classes scheduled for ${selectedDay === 'All' ? 'this week' : selectedDay}.`}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredSessions.map((session, idx) => (
            <div
              key={session._id || idx}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c4b5fd'
                }}>
                  {session.dayOfWeek}
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8125rem',
                  color: '#34d399',
                  fontWeight: 600
                }}>
                  <Clock size={13} /> {session.startTime} - {session.endTime}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>
                  {session.course?.title || session.courseTitle || 'Urban Choreography'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#94a3b8', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  <User size={14} color="#8b5cf6" />
                  <span>{session.instructor?.name || session.instructorName || 'Master Choreographer'}</span>
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
                <span>{session.studioRoom || 'Studio 1 (Main Hall)'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Studio Class"
      >
        <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {conflictError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.375rem',
              color: '#f87171',
              fontSize: '0.8125rem'
            }}>
              <AlertTriangle size={18} />
              <span>{conflictError}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Select Course</label>
            <select
              required
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              style={{
                width: '100%',
                padding: '0.625rem',
                background: '#0a0a0f',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.375rem',
                color: 'white'
              }}
            >
              <option value="">Select course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title} ({c.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Faculty Instructor</label>
            <select
              required
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
              style={{
                width: '100%',
                padding: '0.625rem',
                background: '#0a0a0f',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.375rem',
                color: 'white'
              }}
            >
              <option value="">Select instructor</option>
              {instructors.map(i => (
                <option key={i._id} value={i._id}>{i.name} ({i.specialties?.join(', ')})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Studio Room</label>
              <select
                value={formData.studioRoom}
                onChange={(e) => setFormData({ ...formData, studioRoom: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              >
                <option value="Studio 1 (Main Hall)">Studio 1 (Main Hall)</option>
                <option value="Studio 2 (Mirror Suite)">Studio 2 (Mirror Suite)</option>
                <option value="Studio 3 (Acoustic Floor)">Studio 3 (Acoustic Floor)</option>
                <option value="Studio 4 (Ballet Barre)">Studio 4 (Ballet Barre)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Day of Week</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              >
                {DAYS_OF_WEEK.map(d => {
                  const name = typeof d === 'object' ? (d.label || d.value) : d;
                  return <option key={name} value={name}>{name}</option>;
                })}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Verify & Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
