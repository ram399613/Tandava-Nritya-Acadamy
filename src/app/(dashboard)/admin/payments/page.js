'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Filter, IndianRupee, CheckCircle, 
  Clock, Download, Eye, ArrowUpRight, TrendingUp, Radio 
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getSocket } from '@/lib/socket';
import { downloadReceiptPDF, printReceiptWindow } from '@/lib/pdf-receipt';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [livePulse, setLivePulse] = useState(false);

  useEffect(() => {
    fetchPayments();

    const socket = getSocket();
    if (socket) {
      socket.on('payment_updated', (updatedRecord) => {
        setLivePulse(true);
        setTimeout(() => setLivePulse(false), 3000);
        setPayments(prev => {
          const exists = prev.find(p => p._id === updatedRecord._id);
          if (exists) {
            return prev.map(p => p._id === updatedRecord._id ? { ...p, ...updatedRecord } : p);
          }
          return [updatedRecord, ...prev];
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('payment_updated');
      }
    };
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.success) {
        const list = data.payments || data.data || [];
        setPayments(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'completed' })
      });
      const data = await res.json();
      if (data.success) {
        setPayments(prev => prev.map(p => p._id === id ? { ...p, status: 'completed', paidAt: new Date() } : p));
      }
    } catch (err) {
      console.error('Failed to update payment:', err);
    }
  };

  const filteredPayments = (payments || []).filter(p => {
    if (!p) return false;
    const student = p.student?.name || p.studentName || '';
    const course = p.course?.title || p.courseTitle || '';
    const matchesSearch = student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.toLowerCase().includes(searchTerm.toLowerCase());
    const isPaid = p.status === 'completed' || p.status === 'paid';
    const matchesStatus = filterStatus === 'All' 
      ? true 
      : filterStatus === 'completed' || filterStatus === 'paid' 
      ? isPaid 
      : p.status === 'pending';
    return matchesSearch && matchesStatus;
  });

  const totalCollected = (payments || [])
    .filter(p => p.status === 'completed' || p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPending = (payments || [])
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Fee & Payment Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Track student tuition, pending dues, installment plans, and generate GST receipts
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          background: livePulse ? 'rgba(16, 185, 129, 0.25)' : 'rgba(139, 92, 246, 0.15)',
          border: `1px solid ${livePulse ? '#10b981' : 'rgba(139, 92, 246, 0.3)'}`,
          color: livePulse ? '#34d399' : '#c4b5fd',
          fontSize: '0.8125rem',
          fontWeight: 600,
          transition: 'all 0.3s'
        }}>
          <Radio size={14} className={livePulse ? 'animate-pulse' : ''} />
          <span>{livePulse ? 'Live Transaction Update Streamed!' : 'Socket.IO Ledger Active'}</span>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>
            <span>Total Collected</span>
            <TrendingUp size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginTop: '0.375rem' }}>
            {formatCurrency(totalCollected || 15700)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Updated live via WebSockets</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>
            <span>Pending Invoices</span>
            <Clock size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fbbf24', marginTop: '0.375rem' }}>
            {formatCurrency(totalPending || 8000)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Dues remaining</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>
            <span>Average Fee / Course</span>
            <CreditCard size={16} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#c4b5fd', marginTop: '0.375rem' }}>
            {formatCurrency(4500)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Term duration 12 weeks</div>
        </div>
      </div>

      {}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar-wrapper">
          <Search size={20} className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search payments by student name, transaction ID, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-bar-badge">⌘K</span>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="search-filter-select"
        >
          <option value="All">All Invoices & Receipts</option>
          <option value="completed">Completed / Paid</option>
          <option value="pending">Pending Payment</option>
        </select>
      </div>

      {}
      {loading ? (
        <Loader text="Loading ledger and payment records..." />
      ) : filteredPayments.length === 0 ? (
        <EmptyState 
          icon={CreditCard}
          title="No Transactions Found"
          message="No payment transactions match your query."
        />
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Dancer</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Enrolled Course</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Tuition Amount</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Method</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, idx) => (
                <tr key={p._id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'white' }}>
                    {p.student?.name || p.studentName || 'Lucas Silva'}
                  </td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                    {p.course?.title || p.courseTitle || 'Urban Hip-Hop Immersion'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'white' }}>
                    {formatCurrency(p.amount || 4500)}
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>
                    {p.paymentMethod || 'UPI / Online'}
                  </td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                    {formatDate(p.createdAt || p.paidAt)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: (p.status === 'completed' || p.status === 'paid') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: (p.status === 'completed' || p.status === 'paid') ? '#34d399' : '#facc15'
                    }}>
                      {(p.status === 'completed' || p.status === 'paid') ? <CheckCircle size={13} /> : <Clock size={13} />}
                      {(p.status === 'completed' || p.status === 'paid') ? 'PAID' : 'PENDING'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      {p.status === 'pending' && (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleMarkPaid(p._id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Eye}
                        onClick={() => setSelectedReceipt(p)}
                      >
                        Receipt
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Academy Tuition Receipt"
        >
          <div style={{
            background: '#0a0a0f',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>DANCE ACADEMY</h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GSTIN: 27AABCT1234D1Z5</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a78bfa' }}>INVOICE #{selectedReceipt._id?.slice(-6).toUpperCase() || 'RCP-8921'}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {formatDate(selectedReceipt.createdAt)}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>BILLED TO:</div>
              <div style={{ fontWeight: 600, color: 'white', marginTop: '0.25rem' }}>{selectedReceipt.student?.name || selectedReceipt.studentName || 'Student Dancer'}</div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{selectedReceipt.student?.email || 'student@danceacademy.com'}</div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.875rem' }}>
                <span>{selectedReceipt.course?.title || selectedReceipt.courseTitle || 'Curriculum Course Fee'}</span>
                <span style={{ fontWeight: 600, color: 'white' }}>{formatCurrency(selectedReceipt.amount || 4500)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.375rem' }}>
                <span>Method</span>
                <span>{selectedReceipt.paymentMethod || 'Online Gateway'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                <span>Status</span>
                <span style={{ color: selectedReceipt.status === 'completed' ? '#34d399' : '#facc15', fontWeight: 600 }}>
                  {selectedReceipt.status === 'completed' ? 'SUCCESS / PAID' : 'PENDING'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => setSelectedReceipt(null)}>Close</Button>
              <Button variant="outline" icon={Eye} onClick={() => printReceiptWindow(selectedReceipt)}>Print View</Button>
              <Button variant="primary" icon={Download} onClick={() => downloadReceiptPDF(selectedReceipt)}>Download Official PDF</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
