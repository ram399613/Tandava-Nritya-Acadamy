'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Users, Award, 
  Sparkles, Check, IndianRupee, ShieldCheck, Star 
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();
        if (data.success && data.course) {
          setCourse(data.course);
        } else {
          
          const allRes = await fetch('/api/courses');
          const allData = await allRes.json();
          const list = allData.courses || allData.data || [];
          const found = list.find(c => c._id === id) || list[0];
          setCourse(found);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id })
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledSuccess(true);
        setTimeout(() => {
          setEnrolledSuccess(false);
          setIsEnrollModalOpen(false);
          router.push('/student/enrollments');
        }, 1800);
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader text="Loading course curriculum..." /></div>;
  if (!course) return <div style={{ textAlign: 'center', padding: '5rem', color: 'white' }}>Course not found. <Link href="/courses" style={{ color: '#8b5cf6' }}>Back to catalog</Link></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {}
      <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#c4b5fd', fontSize: '0.875rem' }}>
        <ArrowLeft size={16} /> Back to Course Catalog
      </Link>

      {}
      <div 
        className="glass-panel"
        style={{
          borderRadius: '1.25rem',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          padding: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.25)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#c4b5fd',
              fontSize: '0.8125rem',
              fontWeight: 700
            }}>
              {course.svgIcon ? (
                <img src={course.svgIcon} alt="" style={{ width: '18px', height: '18px' }} />
              ) : null}
              <span>{course.icon || '🩰'}</span>
              <span>{course.category}</span>
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
              Level: <strong style={{ color: 'white' }}>{course.level}</strong>
            </span>
          </div>

          <h1 className="nextjs-gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2 }}>
            {course.title}
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {course.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Duration</div>
              <div style={{ color: 'white', fontWeight: 700, marginTop: '0.25rem' }}>{course.durationWeeks || 12} Weeks Intensive</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Studio Location</div>
              <div style={{ color: 'white', fontWeight: 700, marginTop: '0.25rem' }}>{course.studioRoom || 'Studio 1 (Grand Hall)'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TOTAL TUITION</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{formatCurrency(course.fee)}</div>
            </div>
            <Button variant="primary" size="lg" icon={Sparkles} onClick={() => setIsEnrollModalOpen(true)}>
              Enroll Now
            </Button>
          </div>
        </div>

        {}
        <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', minHeight: '300px' }}>
          <img 
            src={course.photo || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop'} 
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,7,11,0.85) 0%, transparent 50%)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(14, 12, 24, 0.75)',
            backdropFilter: 'blur(12px)',
            padding: '0.5rem 0.875rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#34d399',
            fontSize: '0.8125rem',
            fontWeight: 600
          }}>
            <Users size={14} />
            <span>Seats remaining: {(course.maxCapacity || 25) - (course.enrolledCount || 0)}</span>
          </div>
        </div>
      </div>

      {}
      {isEnrollModalOpen && (
        <Modal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          title={`Confirm Enrollment: ${course.title}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {enrolledSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  marginBottom: '1rem'
                }}>
                  <Check size={36} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
                  Admission Confirmed!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Welcome to {course.title}. Redirecting you to your dancer schedule...
                </p>
              </div>
            ) : (
              <>
                <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  You are about to reserve your studio barre position for <strong>{course.title}</strong> under the <strong>{course.category}</strong> conservatory.
                </p>

                <div style={{ background: '#0a0a0f', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Tuition Fee:</span>
                    <strong style={{ color: 'white' }}>{formatCurrency(course.fee)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Studio Room:</span>
                    <span style={{ color: 'white' }}>{course.studioRoom || 'Studio 1 (Grand Hall)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Weekly Days:</span>
                    <span style={{ color: 'white' }}>{course.scheduleDays?.join(', ') || 'Mon, Wed, Fri'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Button variant="secondary" onClick={() => setIsEnrollModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" loading={enrolling} onClick={handleEnroll}>
                    Confirm & Reserve Barre Position
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
