'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, Send, Plus, Users, UserCheck, AlertTriangle, 
  Info, CheckCircle, Radio, Clock 
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    message: '',
    target: 'all',
    type: 'announcement',
    priority: 'normal'
  });

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();
    if (socket) {
      socket.on('announcement_received', (notice) => {
        setNotifications(prev => [notice, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('announcement_received');
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewNotice({
          title: '',
          message: '',
          target: 'all',
          type: 'announcement',
          priority: 'normal'
        });
        fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to send broadcast:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Academy Bulletin & Announcements
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Broadcast studio updates, schedule changes, masterclasses, and urgent notices
          </p>
        </div>
        <Button variant="primary" icon={Send} onClick={() => setIsModalOpen(true)}>
          Broadcast Announcement
        </Button>
      </div>

      {}
      {loading ? (
        <Loader text="Loading announcements..." />
      ) : notifications.length === 0 ? (
        <EmptyState 
          icon={Bell}
          title="No Announcements"
          message="No broadcast messages have been sent yet. Click 'Broadcast Announcement' to send one."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((n, idx) => (
            <div 
              key={n._id || idx}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                borderLeft: `4px solid ${
                  n.priority === 'urgent' ? '#ef4444' : n.priority === 'high' ? '#f59e0b' : '#8b5cf6'
                }`
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: n.priority === 'urgent' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {n.priority === 'urgent' ? <AlertTriangle size={20} color="#f87171" /> : <Bell size={20} color="#c4b5fd" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>{n.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8'
                    }}>
                      To: {n.target?.toUpperCase() || 'ALL'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Academy Announcement"
      >
        <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Announcement Title</label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              placeholder="e.g. Masterclass Workshop with International Guest Choreographer"
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
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Recipient Group</label>
              <select
                value={newNotice.target}
                onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              >
                <option value="all">Entire Academy (All)</option>
                <option value="students">Students Only</option>
                <option value="instructors">Instructors Only</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Priority Level</label>
              <select
                value={newNotice.priority}
                onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }}
              >
                <option value="normal">Normal Announcement</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Message Content</label>
            <textarea
              rows={4}
              required
              value={newNotice.message}
              onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
              placeholder="Enter announcement details, date, studio room, and attire guidelines..."
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
            <Button variant="primary" type="submit" icon={Send}>Broadcast Now</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
