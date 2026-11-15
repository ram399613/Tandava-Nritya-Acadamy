'use client';

import { useState, useEffect } from 'react';
import {
  FileCheck, Search, Filter, Check, X, Clock,
  User, BookOpen, IndianRupee, CheckCircle, AlertCircle
} from 'lucide-react';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatDate, formatCurrency } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnrollments();

    const socket = getSocket();
    if (socket) {
      socket.on('enrollment_created', (newEnrollment) => {
        setEnrollments(prev => [newEnrollment, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('enrollment_created');
      }
    };
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('/api/enrollments');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.enrollments || data.data)) {
        setEnrollments(data.enrollments || data.data);
      } else {
        setEnrollments([]);
      }
    } catch (err) {
      console.error('Failed to load enrollments:', err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments(prev => (prev || []).map(e => e._id === id ? { ...e, status } : e));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredEnrollments = (enrollments || []).filter(e => {
    if (!e) return false;
    const studentName = e.student?.name || e.studentName || '';
    const courseTitle = e.course?.title || e.courseTitle || '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Course Enrollments
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Review student admissions, approve applications, and track payment receipts
          </p>
        </div>
      </div>

      {}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search enrollment by dancer or course..."
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

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
          <option value="All">All Enrollment Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending Review</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {}
      {loading ? (
        <Loader text="Loading enrollments..." />
      ) : filteredEnrollments.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No Enrollments Found"
          message="No student enrollments found matching the selected filter."
        />
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Dancer</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Dance Course</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Enrolled Date</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Payment</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((en, idx) => (
                <tr key={en._id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'white' }}>{en.student?.name || en.studentName || 'Aarav Patel'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{en.student?.email || 'student@academy.com'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{en.course?.title || en.courseTitle || 'Hip-Hop Urban Choreography'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8b5cf6' }}>{en.course?.category || 'Hip-Hop'}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                    {formatDate(en.createdAt || en.enrollmentDate)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: en.paymentStatus === 'paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: en.paymentStatus === 'paid' ? '#34d399' : '#facc15'
                    }}>
                      {en.paymentStatus?.toUpperCase() || 'PAID'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: en.status === 'active'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : en.status === 'cancelled'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(234, 179, 8, 0.15)',
                      color: en.status === 'active'
                        ? '#34d399'
                        : en.status === 'cancelled'
                          ? '#f87171'
                          : '#facc15'
                    }}>
                      {en.status || 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {en.status === 'pending' ? (
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Check}
                          onClick={() => handleStatusChange(en._id, 'active')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={X}
                          onClick={() => handleStatusChange(en._id, 'cancelled')}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
