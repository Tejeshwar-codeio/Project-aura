import React, { useState } from 'react';
import { Bell, Calendar, AlertCircle, FileText, Download, ExternalLink } from 'lucide-react';

export default function NoticesModule({ notices = [] }) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Examinations', 'Placements', 'Transportation', 'Cultural & Sports'];

  const filtered = notices.filter(n => 
    selectedFilter === 'All' || n.category === selectedFilter
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Campus Announcements & Circulars</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Official university syndicate notices, exam schedules, and placement recruitments
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`btn btn-sm ${selectedFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((item) => (
          <div key={item.id} className="glass-panel" style={{ padding: 22 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${
                  item.urgency === 'Urgent' ? 'badge-rose' :
                  item.urgency === 'High' ? 'badge-amber' : 'badge-primary'
                }`}>
                  {item.urgency}
                </span>
                <span className="badge badge-cyan">{item.category}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span>{item.date}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
              {item.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              {item.content}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <a 
                href={item.pdfLink}
                onClick={(e) => { e.preventDefault(); alert(`Downloading official PDF circular for: ${item.title}`); }}
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                <span>Download Circular PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
