'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileCheck, Clock, MapPin, User, CheckCircle, 
  Calendar, ArrowRight 
} from 'lucide-react';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';

export default function StudentEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyEnrollments() {
      try {
        const res = await fetch('/api/enrollments');
        const data = await res.json();
        if (data.success) {
          setEnrollments(data.enrollments);
        }
      } catch (err) {
        console.error('Failed to load enrollments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyEnrollments();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            My Enrolled Disciplines
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Track active dance curriculums, attendance eligibility, and syllabus milestones
          </p>
        </div>
        <Link href="/student/courses">
          <Button variant="primary">Browse More Courses</Button>
        </Link>
      </div>

      {loading ? (
        <Loader text="Loading your enrollments..." />
      ) : enrollments.length === 0 ? (
        <EmptyState 
          icon={FileCheck}
          title="No Active Enrollments"
          message="You are not enrolled in any dance disciplines yet. Explore our catalog to register!"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {enrollments.map((en, idx) => (
            <div 
              key={en._id || idx}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '0.2rem 0.625rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c4b5fd'
                }}>
                  {en.course?.category || en.category || 'Hip-Hop'}
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px'
                }}>
                  <CheckCircle size={12} /> Active
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                  {en.course?.title || en.courseTitle || 'Urban Choreography'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Enrolled on {formatDate(en.createdAt || en.enrollmentDate)}
                </div>
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
                  <span>Studio 1 (Main Hall)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                  <Clock size={14} color="#8b5cf6" />
                  <span>Mon, Wed, Fri (6:00 PM - 7:30 PM)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <Link href="/student/timetable" style={{ flex: 1, textDecoration: 'none' }}>
                  <Button variant="outline" size="sm" icon={Calendar} style={{ width: '100%' }}>
                    Timetable
                  </Button>
                </Link>
                <Link href="/student/attendance" style={{ flex: 1, textDecoration: 'none' }}>
                  <Button variant="primary" size="sm" style={{ width: '100%' }}>
                    Attendance
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
