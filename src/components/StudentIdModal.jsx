import React from 'react';
import { X, QrCode, ShieldCheck, Bus, Home, Phone, GraduationCap } from 'lucide-react';

export default function StudentIdModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-modal-backdrop)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="glass-panel" style={{
        maxWidth: 480,
        width: '100%',
        padding: 24,
        position: 'relative',
        animation: 'fadeIn 0.25s ease',
        background: 'linear-gradient(145deg, rgba(17, 24, 43, 0.95), rgba(11, 15, 29, 0.98))'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'var(--bg-subtle)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        {/* Card Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--primary-light)', marginBottom: 4 }}>
            <GraduationCap size={22} />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.05em' }}>AURA INSTITUTE OF TECHNOLOGY</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', fontWeight: 600, letterSpacing: '0.1em' }}>
            OFFICIAL DIGITAL STUDENT IDENTITY CARD
          </div>
        </div>

        {/* Card Body */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Avatar and verification */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                src={student.avatar} 
                alt={student.name}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 16,
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: '0 4px 15px var(--primary-glow)'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                background: 'var(--emerald)',
                borderRadius: '50%',
                padding: 4,
                color: 'white',
                display: 'flex'
              }}>
                <ShieldCheck size={14} />
              </span>
            </div>
            <div className="badge badge-emerald" style={{ marginTop: 12, fontSize: '0.65rem' }}>
              VERIFIED ACTIVE
            </div>
          </div>

          {/* Student Meta */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {student.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: 8 }}>
              {student.department}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: '0.78rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Roll No:</span>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{student.rollNo}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Batch:</span>
                <div style={{ fontWeight: 600 }}>{student.batch}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Semester:</span>
                <div style={{ fontWeight: 600 }}>{student.semester}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
                <div style={{ fontWeight: 600, color: 'var(--rose)' }}>{student.bloodGroup}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Affiliations */}
        <div style={{
          marginTop: 18,
          padding: 12,
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Home size={15} color="var(--cyan)" />
            <span style={{ color: 'var(--text-secondary)' }}>Hostel Residence:</span>
            <span style={{ fontWeight: 600, marginLeft: 'auto' }}>{student.hostel?.room || 'Day Scholar'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bus size={15} color="var(--amber)" />
            <span style={{ color: 'var(--text-secondary)' }}>Bus Route:</span>
            <span style={{ fontWeight: 600, marginLeft: 'auto' }}>{student.transport?.routeNumber || 'None'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={15} color="var(--emerald)" />
            <span style={{ color: 'var(--text-secondary)' }}>Emergency Contact:</span>
            <span style={{ fontWeight: 600, marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{student.emergencyContact}</span>
          </div>
        </div>

        {/* Card Footer with Barcode & NFC simulation */}
        <div style={{
          marginTop: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 14
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student ID Barcode</div>
            {/* Simulated barcode */}
            <div style={{
              display: 'flex',
              gap: 2,
              height: 24,
              alignItems: 'center',
              marginTop: 4
            }}>
              {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 1, 2].map((w, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: w, 
                    height: '100%', 
                    background: i % 2 === 0 ? 'var(--text-primary)' : 'var(--primary-light)',
                    borderRadius: 1
                  }} 
                />
              ))}
            </div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>
              {student.id}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <QrCode size={13} />
              <span>TAP NFC GATE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
