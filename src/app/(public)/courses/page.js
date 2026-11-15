'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { courseService } from '@/services/courseService';
import { DANCE_CATEGORIES, formatCurrency } from '@/lib/utils';
import { Search, Clock, Users, User, ArrowRight } from 'lucide-react';
import Loader from '@/components/common/Loader';

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedLevel) params.level = selectedLevel;
        if (searchTerm) params.search = searchTerm;

        const res = await courseService.getCourses(params);
        if (res && Array.isArray(res.courses || res.data)) {
          setCourses(res.courses || res.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [selectedCategory, selectedLevel, searchTerm]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2rem' }}>
      {}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="crazy-badge" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          <span>🔥</span> Next-Gen Conservatory Curriculum
        </div>
        <h1 className="nextjs-heading" style={{ marginBottom: '0.75rem' }}>
          Master Global Dance Disciplines
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '650px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
          16 premier multi-week dance immersions led by international master choreographers with high-definition curriculum photography.
        </p>
      </div>

      {}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar-wrapper">
            <Search size={20} className="search-bar-icon" />
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search conservatory courses, classical styles, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-bar-badge">⌘K</span>
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <select
              className="search-filter-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">All Difficulty Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all-levels">All Levels</option>
            </select>
          </div>
        </div>

        {}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedCategory('')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedCategory === '' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedCategory === '' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedCategory === '' ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            All Categories
          </button>
          {DANCE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.value)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? `1px solid ${cat.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? `${cat.color}25` : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {}
      {loading ? (
        <Loader text="Loading course catalog..." />
      ) : courses.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>No Courses Found</h3>
          <p style={{ color: '#94a3b8' }}>Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {courses.map((course) => {
            const availableSeats = course.capacity - (course.enrolledCount || 0);
            const categoryObj = DANCE_CATEGORIES.find((c) => c.value === course.category);
            const badgeColor = categoryObj ? categoryObj.color : '#8b5cf6';

            return (
              <div
                key={course._id}
                className="glass-card glass-card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {}
                <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                  <img
                    src={course.photo || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop'}
                    alt={course.title || course.name}
                    className="course-card-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,12,24,0.9) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(14,12,24,0.8)',
                      backdropFilter: 'blur(10px)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      {course.svgIcon ? (
                        <img src={course.svgIcon} alt="" style={{ width: '16px', height: '16px' }} />
                      ) : null}
                      <span>{course.icon || '🩰'}</span>
                      <span>{course.category}</span>
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
                      {course.level}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '0.6rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {course.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#94a3b8',
                      lineHeight: 1.5,
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.description}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      padding: '0.85rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '0.82rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                      <Clock size={14} color="#3b82f6" />
                      <span>{course.duration?.value} {course.duration?.unit}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                      <Users size={14} color="#10b981" />
                      <span>{availableSeats} seats left</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                      <span>🏛️</span>
                      <span>{course.studio || 'Studio Nova (A)'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                      <User size={14} color="#8b5cf6" />
                      <span>Certified Faculty</span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tuition Fee</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                        {formatCurrency(course.fee)}
                      </div>
                    </div>

                    <Link
                      href={`/courses/${course._id}`}
                      className="btn btn-primary"
                      style={{
                        padding: '0.6rem 1.25rem',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                      }}
                    >
                      Details & Enroll <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<Loader text="Loading course catalog..." />}>
      <CoursesContent />
    </Suspense>
  );
}
