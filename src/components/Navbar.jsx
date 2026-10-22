import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShoppingBag, 
  Building2, 
  Bell, 
  Sun, 
  Moon, 
  IdCard, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  activePortal, 
  setActivePortal, 
  cartCount, 
  onOpenCart, 
  onOpenIdCard,
  theme, 
  setTheme,
  student,
  noticesCount,
  onOpenNotices
}) {
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="app-header">
      {/* Brand */}
      <div className="brand-logo" onClick={() => setActivePortal('store')}>
        <div className="brand-icon-box">
          <GraduationCap size={24} />
        </div>
        <div>
          <div className="brand-title">AURA CAMPUS</div>
          <div className="brand-subtitle">Smart ERP & Student Store</div>
        </div>
      </div>

      {/* Main Switcher: Store vs ERP */}
      <div className="portal-switcher">
        <button 
          className={`portal-switch-btn ${activePortal === 'store' ? 'active' : ''}`}
          onClick={() => setActivePortal('store')}
        >
          <ShoppingBag size={16} />
          <span>Student Store</span>
        </button>
        <button 
          className={`portal-switch-btn ${activePortal === 'cms' ? 'active' : ''}`}
          onClick={() => setActivePortal('cms')}
        >
          <Building2 size={16} />
          <span>College Management</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="header-actions">
        {/* Cart Trigger (Always accessible) */}
        <button 
          className="icon-btn" 
          onClick={onOpenCart}
          title="Shopping Cart"
        >
          <ShoppingBag size={19} />
          {cartCount > 0 && (
            <span className="counter-bubble">{cartCount}</span>
          )}
        </button>

        {/* Notices Bell */}
        <button 
          className="icon-btn" 
          onClick={onOpenNotices}
          title="Campus Announcements"
        >
          <Bell size={19} />
          {noticesCount > 0 && (
            <span className="counter-bubble" style={{ background: 'var(--amber)' }}>
              {noticesCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Student Profile & Digital ID trigger */}
        {student && (
          <div 
            className="student-pill" 
            onClick={onOpenIdCard}
            title="Click to view Digital Campus ID Card"
          >
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="student-avatar" 
            />
            <div className="student-meta">
              <div className="student-meta-name">{student.name}</div>
              <div className="student-meta-id">{student.rollNo} • {student.department.split(' ')[0]}</div>
            </div>
            <IdCard size={15} color="var(--primary-light)" style={{ marginLeft: 4 }} />
          </div>
        )}
      </div>
    </header>
  );
}
