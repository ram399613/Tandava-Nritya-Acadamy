'use client';

import { useState, useEffect } from 'react';
import { 
  UserCheck, Check, X, Clock, Send, Radio, 
  CheckCircle2, AlertCircle, BookOpen 
} from 'lucide-react';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { getSocket } from '@/lib/socket';
import { getInitials } from '@/lib/utils';

export default function InstructorAttendancePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/students')
        ]);
        const cData = await cRes.json();
        const sData = await sRes.json();
        
        if (cData.success && cData.courses.length > 0) {
          setCourses(cData.courses);
          setSelectedCourse(cData.courses[0]._id);
        }
        if (sData.success) {
          setStudents(sData.students);
          
          const initialMap = {};
          sData.students.forEach(s => {
            initialMap[s._id] = 'present';
          });
          setAttendanceMap(initialMap);
        }
      } catch (err) {
        console.error('Failed to load attendance setup:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s._id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleBroadcast = async () => {
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const records = students.map(s => ({
        studentId: s._id,
        status: attendanceMap[s._id] || 'present'
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse,
          date: new Date().toISOString().split('T')[0],
          records
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Attendance successfully submitted and broadcasted in real time via Socket.IO!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to submit roll call:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const activeCourseObj = courses.find(c => c._id === selectedCourse);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Real-Time Studio Roll Call
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Mark student presence and broadcast live roll call updates to the administrative command center
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.8125rem',
          fontWeight: 600
        }}>
          <Radio size={14} className="animate-pulse" />
          <span>Socket.IO Live Roll Call Enabled</span>
        </div>
      </div>

      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '0.5rem',
          color: '#34d399',
          fontSize: '0.875rem'
        }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}>Select Class Session:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              padding: '0.625rem 1rem',
              background: '#0a0a0f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {courses.map(c => (
              <option key={c._id} value={c._id}>
                {c.title} ({c.studioRoom || 'Studio 1'})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={() => handleMarkAll('present')}>
            Mark All Present
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')}>
            Reset
          </Button>
        </div>
      </div>

      {}
      {loading ? (
        <Loader text="Loading class roster..." />
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Dancer</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Skill Level</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const currentStatus = attendanceMap[s._id] || 'present';
                return (
                  <tr key={s._id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: 'white',
                          fontSize: '0.8125rem'
                        }}>
                          {getInitials(s.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'white' }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                      {s.level || 'Intermediate'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', background: '#0a0a0f', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s._id, 'present')}
                          style={{
                            padding: '0.4rem 0.875rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: currentStatus === 'present' ? '#10b981' : 'transparent',
                            color: currentStatus === 'present' ? 'white' : '#94a3b8',
                            transition: 'all 0.15s'
                          }}
                        >
                          <Check size={14} /> Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s._id, 'absent')}
                          style={{
                            padding: '0.4rem 0.875rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: currentStatus === 'absent' ? '#ef4444' : 'transparent',
                            color: currentStatus === 'absent' ? 'white' : '#94a3b8',
                            transition: 'all 0.15s'
                          }}
                        >
                          <X size={14} /> Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s._id, 'late')}
                          style={{
                            padding: '0.4rem 0.875rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: currentStatus === 'late' ? '#f59e0b' : 'transparent',
                            color: currentStatus === 'late' ? 'white' : '#94a3b8',
                            transition: 'all 0.15s'
                          }}
                        >
                          <Clock size={14} /> Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button 
          variant="primary" 
          size="lg" 
          icon={Send} 
          loading={submitting}
          onClick={handleBroadcast}
        >
          Submit & Broadcast Live Roll Call
        </Button>
      </div>
    </div>
  );
}
