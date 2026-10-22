import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  Plus
} from 'lucide-react';

export default function HelpdeskModule({ tickets = [], onTicketCreated }) {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [category, setCategory] = useState('Fee Department');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/cms/helpdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject, description })
      });
      const data = await res.json();
      if (data.success) {
        if (onTicketCreated) onTicketCreated(data.ticket);
        setShowNewTicket(false);
        setSubject('');
        setDescription('');
      }
    } catch (err) {
      alert('Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Student Grievance & Service Helpdesk</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Submit administrative queries, fee adjustments, bus pass issues, and facility requests
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowNewTicket(true)}
        >
          <Plus size={16} />
          <span>New Support Ticket</span>
        </button>
      </div>

      {showNewTicket && (
        <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--border-highlight)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 4 }}>Submit New Student Grievance / Ticket</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>Escalates directly to Dean of Student Welfare within 24 hours</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Department / Category *
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  <option value="Fee Department">Fee & Accounts Section</option>
                  <option value="Transportation">Transportation & Bus Fleet</option>
                  <option value="Hostel & Mess">Hostel & Mess Administration</option>
                  <option value="Academics & Attendance">Academics & Attendance Waiver</option>
                  <option value="Digital Library">Library & Book Holds</option>
                  <option value="Campus IT & Wi-Fi">Campus IT & Wi-Fi Network</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Subject Summary *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bus Pass scanner not detecting morning commute"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                Detailed Description & Context
              </label>
              <textarea 
                rows={3}
                placeholder="Provide complete details, transaction IDs or bus route numbers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input"
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowNewTicket(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Send size={15} />
                <span>{isSubmitting ? 'Transmitting Ticket...' : 'File Ticket'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket History */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16 }}>Your Active & Past Grievance Records ({tickets.length})</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.map((t) => (
            <div 
              key={t.id}
              className="glass-card"
              style={{ padding: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{t.id}</span>
                  <span className="badge badge-primary">{t.category}</span>
                  <span className={`badge ${
                    t.status === 'Resolved' ? 'badge-emerald' :
                    t.status === 'In Progress' ? 'badge-amber' : 'badge-cyan'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: 4 }}>
                  {t.subject}
                </h4>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Assigned Officer: <strong style={{ color: 'var(--text-primary)' }}>{t.assignedTo}</strong>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--cyan)', marginTop: 4 }}>
                  Latest Status: "{t.lastUpdate}"
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Logged on {t.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
