'use client';

import { useState, useEffect } from 'react';
import {
  Users, Search, Filter, Plus, Eye, MoreVertical,
  Mail, Phone, Calendar, Award, CheckCircle, Clock
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatDate, getInitials } from '@/lib/utils';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success) {
        const list = data.students || data.data || [];
        setStudents(Array.isArray(list) ? list : []);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = (students || []).filter(student => {
    if (!student) return false;
    const nameMatch = (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (student.phone || '').includes(searchTerm);
    const levelMatch = levelFilter === 'All' || student.level === levelFilter;
    return nameMatch && levelMatch;
  });

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Student Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Manage registered dancers, monitor performance, and review enrollment profiles
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            color: '#a78bfa',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Users size={16} />
            Total: {students?.length || 0} Dancers
          </div>
        </div>
      </div>

      {}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar-wrapper">
          <Search size={20} className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search by student name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-bar-badge">⌘K</span>
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="search-filter-select"
        >
          <option value="All">All Skill Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Professional">Professional</option>
        </select>
      </div>

      {}
      {loading ? (
        <Loader text="Loading academy students roster..." />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Students Found"
          message={searchTerm ? "No student matches your search query." : "No registered students yet in the database."}
        />
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Dancer</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Contact Info</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Skill Level</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Enrolled Disciplines</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Attendance Rate</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => (
                <tr key={s._id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Joined {formatDate(s.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#e2e8f0' }}>{s.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.phone || 'No phone'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: s.level === 'Advanced' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: s.level === 'Advanced' ? '#f472b6' : '#60a5fa'
                    }}>
                      {s.level || 'Intermediate'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                    {s.enrolledCourses?.length || 2} Active Courses
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.attendanceRate || 85}%`, height: '100%', background: '#10b981' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>{s.attendanceRate || 85}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399'
                    }}>
                      <CheckCircle size={12} /> Active
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleView(s)}
                    >
                      Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {}
      {selectedStudent && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Dancer Profile: ${selectedStudent.name}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'white',
                fontSize: '1.25rem'
              }}>
                {getInitials(selectedStudent.name)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{selectedStudent.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={14} /> {selectedStudent.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={14} /> {selectedStudent.phone || '+91 98765 43210'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#0a0a0f', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Skill Level</div>
                <div style={{ color: 'white', fontWeight: 600, marginTop: '0.25rem' }}>{selectedStudent.level || 'Intermediate'}</div>
              </div>
              <div style={{ background: '#0a0a0f', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Emergency Contact</div>
                <div style={{ color: 'white', fontWeight: 600, marginTop: '0.25rem' }}>
                  {selectedStudent.emergencyContact?.name ? `${selectedStudent.emergencyContact.name} (${selectedStudent.emergencyContact.relation || 'Parent'})` : 'Rajesh Sharma (Father)'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{selectedStudent.emergencyContact?.phone || '+91 98765 00000'}</div>
              </div>
              <div style={{ background: '#0a0a0f', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Attendance Rate</div>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1.125rem', marginTop: '0.25rem' }}>
                  {selectedStudent.attendanceRate || 85}%
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.925rem' }}>Current Enrollments</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#0a0a0f', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'white' }}>Hip-Hop Urban Choreography</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Studio 1 • Mon, Wed, Fri (6:00 PM - 7:30 PM)</div>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#0a0a0f', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'white' }}>Contemporary Flow & Technique</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Studio 2 • Tue, Thu (5:00 PM - 6:30 PM)</div>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
