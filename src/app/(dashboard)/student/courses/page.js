'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Search, Filter, CheckCircle2, Clock,
  MapPin, IndianRupee, Sparkles, Check
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency, DANCE_CATEGORIES } from '@/lib/utils';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.courses || data.data)) {
        setCourses(data.courses || data.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;
    setEnrolling(true);
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse._id,
          courseTitle: selectedCourse.title || selectedCourse.name,
          fee: selectedCourse.fee,
        })
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledSuccess(true);
        setTimeout(() => {
          setEnrolledSuccess(false);
          setSelectedCourse(null);
          fetchCourses();
        }, 1800);
      } else {
        alert(data.message || 'Enrollment could not be completed.');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Network or server error during enrollment');
    } finally {
      setEnrolling(false);
    }
  };

  const filtered = (courses || []).filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'All' || c.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div>
        <div className="crazy-badge" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
          <span>🔥</span> 16 Elite Conservatory Disciplines
        </div>
        <h1 className="nextjs-heading" style={{ fontSize: '2.1rem', marginBottom: '0.25rem' }}>
          Explore Academy Dance Disciplines
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
          Choose your choreography track, reserve your studio barre position, and begin training
        </p>
      </div>

      {}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar-wrapper">
          <Search size={20} className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search disciplines, classical styles, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-bar-badge">⌘K</span>
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="search-filter-select"
        >
          <option value="All">All Disciplines & Gharanas</option>
          {DANCE_CATEGORIES.map(cat => {
            const val = typeof cat === 'object' ? (cat.label || cat.value) : cat;
            return <option key={val} value={val}>{val}</option>;
          })}
        </select>
      </div>

      {}
      {loading ? (
        <Loader text="Loading catalog..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Courses Found"
          message="No dance courses match your search criteria."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((c, idx) => {
            const seatsLeft = (c.maxCapacity || 20) - (c.enrolledCount || 0);
            return (
              <div
                key={c._id || idx}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {}
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img
                    src={c.photo || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop'}
                    alt={c.title}
                    className="course-card-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,12,24,0.95) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(14,12,24,0.85)',
                      backdropFilter: 'blur(10px)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      {c.svgIcon ? (
                        <img src={c.svgIcon} alt="" style={{ width: '16px', height: '16px' }} />
                      ) : null}
                      <span>{c.icon || '🩰'}</span>
                      <span>{c.category}</span>
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#c4b5fd',
                      background: 'rgba(139,92,246,0.35)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontWeight: 600,
                      border: '1px solid rgba(139,92,246,0.45)',
                    }}>
                      {c.level || 'All Levels'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>{c.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.5, height: '40px', overflow: 'hidden' }}>
                      {c.description || 'Master performance choreography, footwork drills, and body isolations with top faculty.'}
                    </p>
                  </div>

                  <div style={{ background: '#0a0a0f', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Studio:</span>
                      <strong style={{ color: 'white' }}>{c.studioRoom || 'Studio 1'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Schedule:</span>
                      <span>{c.scheduleTime || '6:00 PM - 7:30 PM'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: seatsLeft <= 3 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                      <span>Availability:</span>
                      <span>{seatsLeft} seats remaining</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>TUITION</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{formatCurrency(c.fee)}</div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Sparkles}
                      onClick={() => setSelectedCourse(c)}
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`Enroll in ${selectedCourse.title}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {enrolledSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  marginBottom: '1rem'
                }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                  Enrollment Confirmed!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  You have successfully enrolled into {selectedCourse.title}. Welcome to the studio!
                </p>
              </div>
            ) : (
              <>
                <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  You are confirming enrollment for <strong>{selectedCourse.title}</strong> under the <strong>{selectedCourse.category}</strong> department.
                </p>

                <div style={{ background: '#0a0a0f', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Tuition Fee:</span>
                    <strong style={{ color: 'white' }}>{formatCurrency(selectedCourse.fee)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Studio Location:</span>
                    <span style={{ color: 'white' }}>{selectedCourse.studioRoom || 'Studio 1'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Class Timing:</span>
                    <span style={{ color: 'white' }}>{selectedCourse.scheduleTime || '6:00 PM - 7:30 PM'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Button variant="secondary" onClick={() => setSelectedCourse(null)}>Cancel</Button>
                  <Button variant="primary" loading={enrolling} onClick={handleEnroll}>
                    Confirm & Reserve Seat
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
