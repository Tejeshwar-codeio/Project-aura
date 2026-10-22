import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  FileCheck, 
  TrendingUp, 
  Award,
  FilePlus,
  X,
  ChevronRight
} from 'lucide-react';

export default function AcademicsModule({ academicsData }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveSubject, setLeaveSubject] = useState('CS603');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  if (!academicsData) return null;

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveReason) return;
    setLeaveSubmitted(true);
    setTimeout(() => {
      setLeaveSubmitted(false);
      setShowLeaveModal(false);
      setLeaveReason('');
    }, 2500);
  };

  const currentDaySlots = (academicsData.timetable || []).find(t => t.day === selectedDay)?.slots || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Sub-tab Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Academics, Attendance & Class Schedules</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Biometric attendance logs, 75% shortfall monitor, live lecture halls, and GPA transcripts
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`btn btn-sm ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('attendance')}
          >
            <BarChart3 size={15} />
            <span>Attendance Monitor</span>
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'timetable' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('timetable')}
          >
            <Calendar size={15} />
            <span>Weekly Timetable</span>
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'grades' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('grades')}
          >
            <Award size={15} />
            <span>Grades & SGPA</span>
          </button>
        </div>
      </div>

      {/* ATTENDANCE TAB */}
      {activeTab === 'attendance' && (
        <>
          {/* Top Overall Attendance Banner */}
          <div className="glass-panel" style={{
            padding: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            background: 'linear-gradient(135deg, rgba(17, 24, 43, 0.95), rgba(9, 13, 26, 0.98))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Circular Gauge */}
              <div style={{
                position: 'relative',
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: `conic-gradient(var(--emerald) ${academicsData.overallAttendancePercentage * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px var(--emerald-glow)'
              }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--bg-card-solid)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {academicsData.overallAttendancePercentage}%
                </div>
              </div>

              <div>
                <div className="badge badge-emerald" style={{ marginBottom: 6 }}>
                  <CheckCircle size={12} />
                  <span>Above 75% Eligibility Criteria</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Overall Cumulative Attendance</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Attended <strong style={{ color: 'var(--text-primary)' }}>{academicsData.classesAttended}</strong> out of <strong style={{ color: 'var(--text-primary)' }}>{academicsData.totalClassesConducted}</strong> conducted lectures
                </div>
              </div>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={() => setShowLeaveModal(true)}
            >
              <FilePlus size={16} />
              <span>Apply for Official Leave</span>
            </button>
          </div>

          {/* Subject Attendance Breakdown Cards */}
          <div className="grid-cols-3">
            {academicsData.subjects.map((sub) => {
              const isWarning = sub.percentage < 75.0;

              return (
                <div 
                  key={sub.code}
                  className="glass-card"
                  style={{
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: isWarning ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)',
                    background: isWarning ? 'rgba(244, 63, 94, 0.05)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span className="badge badge-primary">{sub.code}</span>
                    <span className={`badge ${isWarning ? 'badge-rose' : 'badge-emerald'}`}>
                      {isWarning ? '⚠️ Low Attendance' : 'Safe'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                    {sub.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Faculty: {sub.faculty} • Credits: {sub.credits}
                  </div>

                  {/* Percentage Progress Bar */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{sub.attended} / {sub.total} classes</span>
                      <span style={{ fontWeight: 800, color: isWarning ? 'var(--rose)' : 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                        {sub.percentage}%
                      </span>
                    </div>

                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, sub.percentage)}%`,
                        background: isWarning ? 'var(--rose)' : 'var(--emerald)',
                        borderRadius: 3
                      }} />
                    </div>

                    {isWarning && sub.warningNote && (
                      <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', fontSize: '0.72rem', color: 'var(--rose)' }}>
                        {sub.warningNote}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TIMETABLE TAB */}
      {activeTab === 'timetable' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          {/* Day Selector Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedDay === day ? 'var(--primary)' : 'var(--border-subtle)',
                  background: selectedDay === day ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: selectedDay === day ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentDaySlots.map((slot, i) => (
              <div 
                key={i} 
                className="glass-card" 
                style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: slot.type === 'Lab' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: slot.type === 'Lab' ? 'var(--cyan)' : 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    {slot.type}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{slot.subject}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      Venue: <strong style={{ color: 'var(--cyan)' }}>{slot.room}</strong> • Instructor: {slot.faculty}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    <Clock size={14} color="var(--primary-light)" />
                    <span>{slot.time}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--emerald)', marginTop: 2 }}>
                    Confirmed Session
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRADES & TRANSCRIPTS TAB */}
      {activeTab === 'grades' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Semester Performance & Cumulative Grade Point Average</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official University Academic Ledger</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cumulative CGPA:</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>
                8.65 / 10.0
              </div>
            </div>
          </div>

          <div className="grid-cols-3">
            {academicsData.semestersRecord?.map((rec) => (
              <div key={rec.sem} className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>{rec.sem}</span>
                  <span className="badge badge-emerald">GPA: {rec.gpa.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Credits: {rec.credits} Points Earned
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Result: {rec.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-modal-backdrop)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 140,
          padding: 16
        }}>
          <div className="glass-panel" style={{ maxWidth: 480, width: '100%', padding: 24, position: 'relative' }}>
            <button 
              onClick={() => setShowLeaveModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 4 }}>Apply for Academic / Medical Leave</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>Attendance concession upon HOD authorization</p>

            {leaveSubmitted ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--emerald)' }}>
                <CheckCircle size={40} style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontWeight: 700 }}>Leave Application Submitted!</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>Application token sent to Head of Department for review.</p>
              </div>
            ) : (
              <form onSubmit={handleLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Applicable Course / Subject
                  </label>
                  <select 
                    value={leaveSubject}
                    onChange={(e) => setLeaveSubject(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    {academicsData.subjects.map(s => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Leave Reason & Justification *
                  </label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="e.g. Attending ACM ICPC Regional Round / Medical fever with medical certificate"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit to Department
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
