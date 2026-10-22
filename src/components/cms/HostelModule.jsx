import React, { useState } from 'react';
import { 
  Home, 
  Utensils, 
  Phone, 
  Check, 
  Calendar, 
  Sparkles, 
  Coffee, 
  Moon, 
  Sun,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function HostelModule({ hostelData }) {
  const [rebateDays, setRebateDays] = useState(2);
  const [rebateSuccess, setRebateSuccess] = useState(false);
  const [availableDays, setAvailableDays] = useState(hostelData?.messRebateDaysAvailable || 6);

  if (!hostelData) return null;

  const handleRebateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/cms/hostel/mess-rebate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: rebateDays, reason: 'Weekend Home Visit' })
      });
      const data = await res.json();
      if (data.success) {
        setAvailableDays(data.remainingRebateDays);
        setRebateSuccess(true);
        setTimeout(() => setRebateSuccess(false), 4000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Could not submit rebate request');
    }
  };

  const { roomInfo, todayMenu } = hostelData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Hostel Residence & Dining Mess</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Room allotment specifications, daily chef special menu, and dining rebate tracker
        </p>
      </div>

      {/* Room Allotment & Warden Contacts */}
      <div className="grid-cols-2">
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div className="brand-icon-box" style={{ width: 40, height: 40 }}>
              <Home size={20} />
            </div>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: 2 }}>{roomInfo.roomType}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{roomInfo.hostelName}</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.82rem', marginBottom: 18 }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Room Number:</span>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                {roomInfo.roomNumber}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Floor Level:</span>
              <div style={{ fontWeight: 600 }}>{roomInfo.floor}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)' }}>Allocated Roommate:</span>
              <div style={{ fontWeight: 600 }}>Rohan Varma (Roll # 23CSE112 - CSE Batch)</div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
            Room Facilities & Inclusions:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.75rem' }}>
            {roomInfo.amenities?.map((amenity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--emerald)' }}>
                <Check size={14} /> <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warden & Emergency Contact */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: 8 }}>
              <ShieldCheck size={12} />
              <span>Hostel Administration Desk</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>Chief Hostel Warden</h3>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {roomInfo.warden.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Office Hours: {roomInfo.warden.officeHours}
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              Emergency Hotline & Room Maintenance:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>
                {roomInfo.warden.contact}
              </span>
              <a href={`tel:${roomInfo.warden.contact}`} className="btn btn-secondary btn-sm">
                <Phone size={13} />
                <span>Call Warden</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Mess Menu */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Utensils size={18} color="var(--amber)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Today's Dining Hall Menu ({todayMenu.day})</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>FSSAI Certified Nutritional Student Kitchen</p>
          </div>

          <div className="badge badge-cyan">Special Festivities Menu</div>
        </div>

        <div className="grid-cols-4">
          <div className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
              <Sun size={15} /> <span>BREAKFAST (07:30 - 09:30 AM)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {todayMenu.breakfast}
            </p>
          </div>

          <div className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary-light)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
              <Utensils size={15} /> <span>LUNCH (12:30 - 02:30 PM)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {todayMenu.lunch}
            </p>
          </div>

          <div className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--cyan)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
              <Coffee size={15} /> <span>EVENING SNACKS (05:00 - 06:15 PM)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {todayMenu.snacks}
            </p>
          </div>

          <div className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--purple)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
              <Moon size={15} /> <span>DINNER (08:00 - 10:00 PM)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {todayMenu.dinner}
            </p>
          </div>
        </div>

        {/* Mess Rebate Application Form */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Apply for Mess Bill Rebate</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Going home for weekend or vacation? Rebate saves ₹120/day off your next semester fee.
            </p>
          </div>

          <form onSubmit={handleRebateSubmit} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Days:</span>
            <input 
              type="number" 
              min={1} 
              max={availableDays} 
              value={rebateDays}
              onChange={(e) => setRebateDays(Number(e.target.value))}
              className="glass-input" 
              style={{ width: 70, textAlign: 'center', padding: '6px 10px' }}
            />
            <button 
              type="submit" 
              className="btn btn-secondary btn-sm"
              disabled={availableDays <= 0}
            >
              Request Rebate ({availableDays} days left)
            </button>
          </form>
        </div>

        {rebateSuccess && (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', fontSize: '0.8rem', textAlign: 'center' }}>
            ✓ Mess rebate approved for {rebateDays} days! Credit adjusted in campus bursar account.
          </div>
        )}
      </div>
    </div>
  );
}
