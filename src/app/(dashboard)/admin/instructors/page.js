'use client';

import { useState, useEffect } from 'react';
import { 
  Award, Search, Plus, Mail, Phone, Calendar, 
  BookOpen, Star, CheckCircle, Clock 
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { getInitials } from '@/lib/utils';

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: 'Hip-Hop, Urban',
    experienceYears: 5,
    bio: ''
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch('/api/instructors');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.instructors || data.data)) {
        setInstructors(data.instructors || data.data);
      } else {
        setInstructors([]);
      }
    } catch (err) {
      console.error('Failed to load instructors:', err);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newInstructor,
        specialties: newInstructor.specialties.split(',').map(s => s.trim())
      };
      const res = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewInstructor({
          name: '',
          email: '',
          phone: '',
          specialties: 'Hip-Hop, Urban',
          experienceYears: 5,
          bio: ''
        });
        fetchInstructors();
      }
    } catch (err) {
      console.error('Failed to create instructor:', err);
    }
  };

  const filteredInstructors = (instructors || []).filter(inst => {
    if (!inst) return false;
    return inst.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           inst.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           inst.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Faculty & Instructors
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Manage elite choreographers, master instructors, and teaching schedules
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Instructor
        </Button>
      </div>

      {}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search instructors by name, specialty, or email..."
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
        <Loader text="Loading faculty members..." />
      ) : filteredInstructors.length === 0 ? (
        <EmptyState 
          icon={Award}
          title="No Instructors Found"
          message="No faculty profiles match your search criteria."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredInstructors.map((inst, idx) => (
            <div 
              key={inst._id || idx}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '1.125rem'
                }}>
                  {getInitials(inst.name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>{inst.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                    <Star size={12} fill="#fbbf24" />
                    <span>{inst.rating || 4.9} Master Choreographer</span>
                  </div>
                </div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.5, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {inst.bio || 'World-class dance instructor with extensive professional training and international performance experience.'}
              </p>

              {}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disciplines</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {(inst.specialties || ['Contemporary', 'Ballet']).map((spec, i) => (
                    <span 
                      key={i}
                      style={{
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#c4b5fd'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginTop: 'auto',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <BookOpen size={14} color="#8b5cf6" />
                  <span>{inst.assignedCourses?.length || 3} Active Classes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Clock size={14} color="#10b981" />
                  <span>{inst.experienceYears || 8} yrs Exp</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Faculty Instructor"
      >
        <form onSubmit={handleCreateInstructor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Full Name</label>
            <input
              type="text"
              required
              value={newInstructor.name}
              onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
              placeholder="e.g. Mikhail Baryshnikov"
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
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Email</label>
              <input
                type="email"
                required
                value={newInstructor.email}
                onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                placeholder="instructor@academy.com"
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
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Phone</label>
              <input
                type="text"
                value={newInstructor.phone}
                onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })}
                placeholder="+91 98765 43210"
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
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Specialties (comma separated)</label>
            <input
              type="text"
              value={newInstructor.specialties}
              onChange={(e) => setNewInstructor({ ...newInstructor, specialties: e.target.value })}
              placeholder="Hip-Hop, Breaking, Locking"
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
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Bio & Achievements</label>
            <textarea
              rows={3}
              value={newInstructor.bio}
              onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
              placeholder="Brief biography and artistic experience..."
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
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Instructor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
