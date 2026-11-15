'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff' }}>Get in Touch</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>
          Have questions regarding auditions, course levels, or studio availability? Contact our admissions office.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>LOCATION</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginTop: '0.1rem' }}>
                Phagwara, Punjab, India
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Tandava Nritya Conservatory Campus</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Phone size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PHONE SUPPORT</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginTop: '0.1rem' }}>
                +91 91777-0999
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Mon - Sat: 9:00 AM - 9:00 PM IST</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>EMAIL ADMISSIONS</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginTop: '0.1rem' }}>
                admissions@tandavanritya.academy
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>24/7 online inquiries</div>
            </div>
          </div>
        </div>

        {}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Check size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                Message Dispatched!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                An academy dance coordinator will respond to your inquiry within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Send Us a Note
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Your Full Name
                </label>
                <input type="text" required className="form-input" style={{ width: '100%' }} placeholder="Aria Vance" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input type="email" required className="form-input" style={{ width: '100%' }} placeholder="aria@example.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Message / Inquiry
                </label>
                <textarea rows="4" required className="form-input" style={{ width: '100%', resize: 'none' }} placeholder="Tell us about your dance goals..." />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', width: '100%', fontSize: '0.95rem' }}>
                <Send size={16} /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
