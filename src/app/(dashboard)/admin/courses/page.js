'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Search, Plus, Filter, Edit, Trash2,
  Users, IndianRupee, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency, DANCE_CATEGORIES } from '@/lib/utils';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hip-Hop',
    level: 'Beginner',
    description: '',
    fee: 4500,
    durationWeeks: 12,
    maxCapacity: 20,
    studioRoom: 'Studio 1 (Main Hall)',
    scheduleDays: 'Mon, Wed, Fri',
    scheduleTime: '6:00 PM - 7:30 PM'
  });

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

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      category: 'Hip-Hop',
      level: 'Beginner',
      description: '',
      fee: 4500,
      durationWeeks: 12,
      maxCapacity: 20,
      studioRoom: 'Studio 1 (Main Hall)',
      scheduleDays: 'Mon, Wed, Fri',
      scheduleTime: '6:00 PM - 7:30 PM'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      level: course.level,
      description: course.description || '',
      fee: course.fee,
      durationWeeks: course.durationWeeks || 12,
      maxCapacity: course.maxCapacity || 20,
      studioRoom: course.studioRoom || 'Studio 1',
      scheduleDays: course.scheduleDays?.join(', ') || 'Mon, Wed, Fri',
      scheduleTime: course.scheduleTime || '6:00 PM - 7:30 PM'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        scheduleDays: typeof formData.scheduleDays === 'string'
          ? formData.scheduleDays.split(',').map(s => s.trim())
          : formData.scheduleDays
      };

      const url = editingCourse ? `/api/courses/${editingCourse._id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCourses();
      }
    } catch (err) {
      console.error('Failed to save course:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this course?')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
      }
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const filteredCourses = (courses || []).filter(c => {
    if (!c) return false;
    const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="crazy-badge" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
            <span>🔥</span> Course Curriculum & Barre Capacity
          </div>
          <h1 className="nextjs-heading" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            Curriculum Management
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
            Configure studio disciplines, pricing, schedule slots, and enrollment capacity
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Create New Course
        </Button>
      </div>

      {}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar-wrapper">
          <Search size={20} className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search courses by discipline, title, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-bar-badge">⌘K</span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
        <Loader text="Loading academy courses..." />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Courses Found"
          message="No dance curriculum matches your criteria. Create one using the button above."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map((c, idx) => {
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
                      {c.level}
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

                {}
                <div style={{ background: '#0a0a0f', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Studio:</span>
                    <strong style={{ color: 'white' }}>{c.studioRoom || 'Studio 1'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Capacity:</span>
                    <span style={{ color: seatsLeft <= 3 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                      {c.enrolledCount || 0} / {c.maxCapacity || 20} ({seatsLeft} seats left)
                    </span>
                  </div>
                </div>

                {}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  marginTop: 'auto'
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>TUITION FEE</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{formatCurrency(c.fee)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="outline" size="sm" icon={Edit} onClick={() => handleOpenEdit(c)} />
                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(c._id)} />
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Dance Course' : 'Create New Dance Course'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Advanced Contemporary Flow & Dynamics"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Dance Discipline</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              >
                {DANCE_CATEGORIES.map(cat => {
                  const val = typeof cat === 'object' ? (cat.label || cat.value) : cat;
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Skill Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Fee (INR)</label>
              <input
                type="number"
                required
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
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
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Duration (Weeks)</label>
              <input
                type="number"
                value={formData.durationWeeks}
                onChange={(e) => setFormData({ ...formData, durationWeeks: Number(e.target.value) })}
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
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Max Capacity</label>
              <input
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Studio Room</label>
              <input
                type="text"
                value={formData.studioRoom}
                onChange={(e) => setFormData({ ...formData, studioRoom: e.target.value })}
                placeholder="Studio 1 (Main Hall)"
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
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Schedule Time</label>
              <input
                type="text"
                value={formData.scheduleTime}
                onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                placeholder="6:00 PM - 7:30 PM"
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

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Course overview, syllabus and goals..."
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editingCourse ? 'Save Changes' : 'Publish Course'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
