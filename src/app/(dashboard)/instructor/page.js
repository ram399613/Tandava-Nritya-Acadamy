'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Users, Calendar, CheckCircle2, Clock,
  ArrowRight, Radio, Award, AlertCircle
} from 'lucide-react';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, tRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/timetable')
        ]);
        const cData = await cRes.json();
        const tData = await tRes.json();
        if (cData.success) setCourses(cData.courses.slice(0, 3));
        if (tData.success) setSessions(tData.sessions.slice(0, 4));
      } catch (err) {
        console.error('Failed to load instructor dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '1rem',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
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
            Faculty Choreographer Portal
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name || 'Instructor'}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.6 }}>
            You have 2 studio classes scheduled today. Launch real-time roll call or review student progress notes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/instructor/attendance">
              <Button variant="primary" icon={CheckCircle2}>
                Start Roll Call
              </Button>
            </Link>
            <Link href="/instructor/timetable">
              <Button variant="outline" icon={Calendar}>
                View My Teaching Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Assigned Courses</span>
            <BookOpen size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginTop: '0.5rem' }}>3</div>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '0.25rem' }}>Contemporary & Hip-Hop</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Enrolled Dancers</span>
            <Users size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginTop: '0.5rem' }}>48</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>94% average attendance</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Classes Today</span>
            <Clock size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.5rem' }}>2</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Next: 6:00 PM (Studio 1)</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '0.875rem' }}>Studio Rating</span>
            <Award size={20} color="#ec4899" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f472b6', marginTop: '0.5rem' }}>4.9/5</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>From 120 student reviews</div>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>Today&apos;s Class Schedule</h2>
            <Link href="/instructor/timetable" style={{ color: '#8b5cf6', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
              Full Week <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sessions.map((s, idx) => (
              <div
                key={s._id || idx}
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
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.925rem' }}>
                    {s.course?.title || s.courseTitle || 'Hip-Hop Urban Choreography'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {s.studioRoom || 'Studio 1'} • {s.startTime} - {s.endTime}
                  </div>
                </div>
                <Link href={`/instructor/attendance`}>
                  <Button variant="primary" size="sm">
                    Roll Call
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>My Active Disciplines</h2>
            <Link href="/instructor/classes" style={{ color: '#8b5cf6', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
              View All <ArrowRight size={14} />
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
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981' }}>
                    {c.enrolledCount || 16} Dancers
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {c.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
