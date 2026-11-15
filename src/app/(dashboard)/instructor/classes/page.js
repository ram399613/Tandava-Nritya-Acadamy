'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Users, Clock, MapPin, Calendar,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';

export default function InstructorClassesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
          My Assigned Classes & Curriculums
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Overview of courses, enrolled dancer capacity, syllabus schedule, and designated studio rooms
        </p>
      </div>

      {loading ? (
        <Loader text="Loading your assigned classes..." />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Classes Assigned"
          message="You currently have no dance classes assigned to your schedule."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {courses.map((c, idx) => (
            <div
              key={c._id || idx}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  padding: '0.2rem 0.625rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c4b5fd'
                }}>
                  {c.category}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.25rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#94a3b8'
                }}>
                  {c.level}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>{c.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.5, height: '40px', overflow: 'hidden' }}>
                  {c.description || 'Professional dance coaching with master choreography, musicality drills, and body isolations.'}
                </p>
              </div>

              <div style={{
                background: '#0a0a0f',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.8125rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                  <MapPin size={14} color="#ec4899" />
                  <span>{c.studioRoom || 'Studio 1 (Main Hall)'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                  <Clock size={14} color="#8b5cf6" />
                  <span>{c.scheduleTime || '6:00 PM - 7:30 PM'} ({c.scheduleDays?.join(', ') || 'Mon, Wed, Fri'})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600 }}>
                  <Users size={14} />
                  <span>{c.enrolledCount || 16} Dancers Enrolled</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <Link href="/instructor/attendance" style={{ flex: 1, textDecoration: 'none' }}>
                  <Button variant="primary" size="sm" icon={CheckCircle2} style={{ width: '100%' }}>
                    Take Roll Call
                  </Button>
                </Link>
                <Link href="/instructor/students" style={{ flex: 1, textDecoration: 'none' }}>
                  <Button variant="outline" size="sm" icon={Users} style={{ width: '100%' }}>
                    View Roster
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
