'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSocket } from '@/lib/socket';
import { formatCurrency, formatDate } from '@/lib/utils';
import Loader from '@/components/common/Loader';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const socket = getSocket();
    if (socket) {
      socket.on('new_enrollment', () => fetchDashboardData());
      socket.on('attendance_updated', () => fetchDashboardData());
      socket.on('timetable_updated', () => fetchDashboardData());
    }

    return () => {
      if (socket) {
        socket.off('new_enrollment');
        socket.off('attendance_updated');
        socket.off('timetable_updated');
      }
    };
  }, []);

  if (loading) return <Loader text="Aggregating academy analytics..." />;
  if (!data) return null;

  return (
    <div>
      {}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Admin Command Center</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Real-time academy performance, enrollments, timetables, and financial analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/courses" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            + Create Course
          </Link>
          <Link href="/admin/timetable" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Schedule Session
          </Link>
        </div>
      </div>

      {}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {[
          { label: 'Total Students', value: data.counts.students, icon: Users, color: '#8b5cf6', trend: '+12% this month' },
          { label: 'Active Instructors', value: data.counts.instructors, icon: GraduationCap, color: '#3b82f6' },
          { label: 'Active Courses', value: data.counts.courses, icon: BookOpen, color: '#10b981' },
          { label: 'Monthly Revenue', value: formatCurrency(data.revenue.monthly), icon: DollarSign, color: '#10b981', trend: '+18% vs last mo' },
          { label: "Today's Classes", value: data.counts.todayClasses, icon: Calendar, color: '#f59e0b' },
          { label: 'Pending Payments', value: data.counts.pendingPayments, icon: AlertCircle, color: '#ef4444', trend: formatCurrency(data.revenue.pendingAmount) },
          { label: 'Attendance Rate', value: `${data.counts.attendanceRate}%`, icon: TrendingUp, color: '#8b5cf6', trend: 'Live Sync' },
          { label: 'Active Enrollments', value: data.counts.activeEnrollments, icon: Users, color: '#c084fc' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>{card.label}</span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${card.color}18`,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{card.value}</div>
              {card.trend && (
                <div style={{ fontSize: '0.75rem', color: card.color, marginTop: '0.35rem', fontWeight: 600 }}>
                  {card.trend}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Revenue Trajectory (₹)</h3>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>● Upward Growth</span>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.revenueTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: '#12121a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Students by Dance Category</h3>
            <span style={{ fontSize: '0.78rem', color: '#8b5cf6', fontWeight: 600 }}>Active Cohorts</span>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#12121a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(val) => [val, 'Students']}
                />
                <Bar dataKey="students" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Today's Academy Schedule</h3>
            <Link href="/admin/timetable" style={{ fontSize: '0.82rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Full Timetable <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.todayClassesList.map((cls) => (
              <div
                key={cls._id}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{cls.course}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {cls.instructor} • {cls.studio}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8b5cf6' }}>{cls.time}</div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
                    {cls.enrolled} Dancers
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Recent Registrations</h3>
            <Link href="/admin/students" style={{ fontSize: '0.82rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Manage All <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.recentStudents.map((st) => (
              <div
                key={st._id}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {st.fullName.charAt(0)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>{st.fullName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {st.email}
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
