import React, { useState } from 'react';
import { 
  CreditCard, 
  Bus, 
  BarChart3, 
  BookOpen, 
  Home, 
  Bell, 
  HelpCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import FeesModule from './cms/FeesModule';
import TransportModule from './cms/TransportModule';
import AcademicsModule from './cms/AcademicsModule';
import LibraryModule from './cms/LibraryModule';
import HostelModule from './cms/HostelModule';
import NoticesModule from './cms/NoticesModule';
import HelpdeskModule from './cms/HelpdeskModule';

export default function CMSView({ 
  student, 
  fees, 
  onPayFee, 
  transport, 
  academics, 
  library, 
  hostel, 
  notices, 
  helpdesk,
  onTicketCreated 
}) {
  const [activeModule, setActiveModule] = useState('fees');

  const navItems = [
    { id: 'fees', label: 'Fees & Dues', icon: CreditCard, badge: fees?.pendingDue > 0 ? `₹${fees.pendingDue}` : 'Cleared', badgeType: fees?.pendingDue > 0 ? 'badge-amber' : 'badge-emerald' },
    { id: 'transport', label: 'Transportation & Fleet', icon: Bus, badge: 'Live GPS', badgeType: 'badge-cyan' },
    { id: 'academics', label: 'Academics & Attendance', icon: BarChart3, badge: `${academics?.overallAttendancePercentage || 86}%`, badgeType: 'badge-emerald' },
    { id: 'library', label: 'Library & Holds', icon: BookOpen, badge: `${library?.borrowedBooks?.length || 2} Books`, badgeType: 'badge-primary' },
    { id: 'hostel', label: 'Hostel & Mess', icon: Home, badge: 'Room C-304', badgeType: 'badge-primary' },
    { id: 'notices', label: 'Announcements', icon: Bell, badge: `${notices?.length || 4} New`, badgeType: 'badge-rose' },
    { id: 'helpdesk', label: 'Service Helpdesk', icon: HelpCircle, badge: 'Support', badgeType: 'badge-primary' }
  ];

  return (
    <div>
      {/* CMS Sub-Navbar */}
      <div className="cms-subnav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              className={`cms-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`badge ${item.badgeType}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="container" style={{ paddingTop: 20 }}>
        {/* Quick Student Banner */}
        <div className="glass-card" style={{
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.04))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="brand-icon-box" style={{ width: 44, height: 44 }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                {student.name} • {student.rollNo}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {student.department} • {student.semester} ({student.batch})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>CGPA: </span>
              <strong style={{ color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>{student.cgpa}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Attendance: </span>
              <strong style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>{academics?.overallAttendancePercentage || 86.4}%</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Pending Fee: </span>
              <strong style={{ color: fees?.pendingDue > 0 ? 'var(--amber)' : 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                ₹{fees?.pendingDue || 0}
              </strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-indicator" />
              <span style={{ color: 'var(--cyan)' }}>Next: OS Lab at 02:00 PM (Lab 04)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Module Rendering */}
        {activeModule === 'fees' && (
          <FeesModule fees={fees} onPayFee={onPayFee} />
        )}

        {activeModule === 'transport' && (
          <TransportModule transportData={transport} />
        )}

        {activeModule === 'academics' && (
          <AcademicsModule academicsData={academics} />
        )}

        {activeModule === 'library' && (
          <LibraryModule libraryData={library} />
        )}

        {activeModule === 'hostel' && (
          <HostelModule hostelData={hostel} />
        )}

        {activeModule === 'notices' && (
          <NoticesModule notices={notices} />
        )}

        {activeModule === 'helpdesk' && (
          <HelpdeskModule tickets={helpdesk} onTicketCreated={onTicketCreated} />
        )}
      </div>
    </div>
  );
}
