import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Bookmark, 
  Search,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function LibraryModule({ libraryData }) {
  const [borrowed, setBorrowed] = useState(libraryData?.borrowedBooks || []);
  const [catalog, setCatalog] = useState(libraryData?.catalog || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState(null);

  if (!libraryData) return null;

  const handleRenew = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cms/library/renew/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBorrowed(prev => prev.map(b => b.id === id ? data.book : b));
        setMessage(`Book renewed successfully! Due date extended.`);
        setTimeout(() => setMessage(null), 3500);
      }
    } catch (err) {
      alert('Failed to renew book');
    }
  };

  const handleReserve = async (bookId) => {
    try {
      const res = await fetch('http://localhost:5000/api/cms/library/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId })
      });
      const data = await res.json();
      if (data.success) {
        setCatalog(prev => prev.map(c => c.id === bookId ? { ...c, copiesAvailable: Math.max(0, c.copiesAvailable - 1) } : c));
        setMessage(data.message);
        setTimeout(() => setMessage(null), 4000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Could not reserve book');
    }
  };

  const filteredCatalog = catalog.filter(c => 
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Central Digital & Physical Library</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Track issued physical copies, due return dates, fine alerts, and reserve rack volumes
        </p>
      </div>

      {message && (
        <div style={{ padding: 12, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Currently Issued Books */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16 }}>Currently Issued Books ({borrowed.length})</h3>

        <div className="grid-cols-2">
          {borrowed.map((b) => {
            const isOverdue = b.daysRemaining < 0;

            return (
              <div 
                key={b.id}
                className="glass-card"
                style={{
                  padding: 18,
                  borderColor: isOverdue ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)',
                  background: isOverdue ? 'rgba(244, 63, 94, 0.05)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="badge badge-primary">{b.accessionNo}</span>
                  <span className={`badge ${isOverdue ? 'badge-rose' : 'badge-emerald'}`}>
                    {isOverdue ? `Overdue by ${Math.abs(b.daysRemaining)} days` : `${b.daysRemaining} days left`}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
                  {b.title}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                  <div>
                    <span>Issued Date:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.issueDate}</div>
                  </div>
                  <div>
                    <span>Return Due Date:</span>
                    <div style={{ fontWeight: 700, color: isOverdue ? 'var(--rose)' : 'var(--emerald)' }}>{b.dueDate}</div>
                  </div>
                  {isOverdue && (
                    <div style={{ gridColumn: 'span 2', color: 'var(--rose)', fontWeight: 600 }}>
                      Accumulated Overdue Fine: ₹{b.fineAccumulated} (₹5/day)
                    </div>
                  )}
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => handleRenew(b.id)}
                >
                  <RefreshCw size={13} />
                  <span>Renew Borrowing for 14 Days</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catalog Search & Shelf Reservation */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Search Physical Library Racks & Reserve Copies</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Over 45,000 engineering and scientific reference books</p>
          </div>

          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search library catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: 38, fontSize: '0.82rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredCatalog.map((item) => (
            <div 
              key={item.id}
              className="glass-card"
              style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{item.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--cyan)' }}>
                  <MapPin size={13} />
                  <span>Shelf Location: {item.floor}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '0.8rem', color: item.copiesAvailable > 0 ? 'var(--emerald)' : 'var(--rose)', fontWeight: 600 }}>
                  {item.copiesAvailable > 0 ? `● ${item.copiesAvailable} copies available` : '● All copies in circulation'}
                </span>

                <button 
                  className="btn btn-primary btn-sm"
                  disabled={item.copiesAvailable <= 0}
                  onClick={() => handleReserve(item.id)}
                >
                  <Bookmark size={13} />
                  <span>Reserve Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
