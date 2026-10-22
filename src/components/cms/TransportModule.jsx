import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Phone, 
  QrCode, 
  Users, 
  Gauge, 
  Compass, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function TransportModule({ transportData }) {
  const [liveBus, setLiveBus] = useState(transportData?.studentRoute || null);
  const [passDetails, setPassDetails] = useState(transportData?.passDetails || null);
  const [selectedRouteTab, setSelectedRouteTab] = useState('live');
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);

  // Poll live telemetry simulation every 4 seconds
  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/transport/live-bus');
        if (res.ok) {
          const data = await res.json();
          setLiveBus(data);
        }
      } catch (err) {
        // Fallback simulate locally
        setLiveBus(prev => {
          if (!prev) return prev;
          const nextSpeed = Math.floor(28 + Math.random() * 12);
          return { ...prev, currentSpeedKmH: nextSpeed };
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleRenewPass = async () => {
    setIsRenewing(true);
    try {
      const res = await fetch('http://localhost:5000/api/cms/transport/renew-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semesterExtension: true })
      });
      const data = await res.json();
      if (data.success) {
        setPassDetails(data.pass);
        setRenewSuccess(true);
        setTimeout(() => setRenewSuccess(false), 4000);
      }
    } catch (err) {
      alert('Failed to contact transport authority');
    } finally {
      setIsRenewing(false);
    }
  };

  if (!transportData || !liveBus) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Module Header Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Campus Fleet & Smart Transportation</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time GPS bus tracking, seat occupancy radar & digital semester bus pass
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`btn btn-sm ${selectedRouteTab === 'live' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedRouteTab('live')}
          >
            <Bus size={15} />
            <span>My Bus (Route 04)</span>
          </button>
          <button 
            className={`btn btn-sm ${selectedRouteTab === 'pass' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedRouteTab('pass')}
          >
            <QrCode size={15} />
            <span>Digital Bus Pass</span>
          </button>
          <button 
            className={`btn btn-sm ${selectedRouteTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedRouteTab('directory')}
          >
            <span>All Campus Routes ({transportData.allRoutes?.length || 6})</span>
          </button>
        </div>
      </div>

      {selectedRouteTab === 'live' && (
        <>
          {/* Telemetry Dashboard Row */}
          <div className="grid-cols-4">
            <div className="glass-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <Clock size={14} color="var(--cyan)" />
                <span style={{ textTransform: 'uppercase' }}>ETA to Your Stop</span>
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                {liveBus.etaToStudentStopMin} mins
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Boarding: {liveBus.studentBoardingStop}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <Gauge size={14} color="var(--emerald)" />
                <span style={{ textTransform: 'uppercase' }}>Current Speed</span>
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                {liveBus.currentSpeedKmH} km/h
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Live GPS Stream Active
              </div>
            </div>

            <div className="glass-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <Users size={14} color="var(--amber)" />
                <span style={{ textTransform: 'uppercase' }}>Seat Availability</span>
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                {liveBus.availableSeats} Free
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                {liveBus.occupiedSeats} / {liveBus.totalCapacity} Seats Occupied
              </div>
            </div>

            <div className="glass-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <Bus size={14} color="var(--primary-light)" />
                <span style={{ textTransform: 'uppercase' }}>Vehicle Plate</span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                {liveBus.busNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                Route 04 Express Shuttle
              </div>
            </div>
          </div>

          {/* Interactive Route Timeline & Map Simulation */}
          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="pulse-indicator" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Route 04: Live Stops & Bus Position Tracker</h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {liveBus.routeName} • Scheduled Pickup at {liveBus.scheduledPickup}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="badge badge-emerald">
                  <CheckCircle size={12} />
                  <span>On Schedule</span>
                </div>
              </div>
            </div>

            {/* Visual Route Path Line */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', paddingLeft: 12 }}>
              {/* Vertical connector line */}
              <div style={{
                position: 'absolute',
                top: 20,
                bottom: 20,
                left: 27,
                width: 3,
                background: 'linear-gradient(to bottom, var(--emerald) 40%, var(--primary) 70%, var(--border-subtle) 100%)',
                zIndex: 1
              }} />

              {liveBus.stops.map((stop, idx) => {
                const isCurrentStop = idx === liveBus.currentStopIndex;

                return (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    {/* Stop Node Dot */}
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: stop.passed 
                        ? 'var(--emerald)' 
                        : stop.isUserStop 
                        ? 'var(--primary)' 
                        : 'var(--bg-card-solid)',
                      border: stop.isUserStop 
                        ? '3px solid #ffffff' 
                        : '2px solid var(--border-subtle)',
                      boxShadow: stop.isUserStop ? '0 0 15px var(--primary-glow)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {stop.passed ? <CheckCircle size={16} /> : (idx + 1)}
                    </div>

                    {/* Stop Details Card */}
                    <div className="glass-card" style={{
                      flex: 1,
                      padding: '12px 18px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: stop.isUserStop ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                      borderColor: stop.isUserStop ? 'var(--primary)' : 'var(--border-subtle)'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{stop.name}</span>
                          {stop.isUserStop && (
                            <span className="badge badge-primary">Your Boarding Stop</span>
                          )}
                          {isCurrentStop && (
                            <span className="badge badge-amber" style={{ animation: 'pulseDot 1.5s infinite' }}>
                              Bus Location
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          Scheduled: {stop.time}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                        {stop.passed ? (
                          <span style={{ color: 'var(--emerald)' }}>Passed</span>
                        ) : stop.isUserStop ? (
                          <span style={{ color: 'var(--cyan)' }}>Arriving in {liveBus.etaToStudentStopMin} mins</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Upcoming Stop</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assigned Driver Contact Bar */}
            <div className="glass-card" style={{ marginTop: 24, padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                  HC
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{liveBus.driver.name} (Assigned Senior Captain)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Experience: {liveBus.driver.experience} • Rating: ⭐ {liveBus.driver.rating}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a 
                  href={`tel:${liveBus.driver.phone}`} 
                  className="btn btn-emerald btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={14} />
                  <span>Call Driver ({liveBus.driver.phone})</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Digital Bus Pass Tab */}
      {selectedRouteTab === 'pass' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass-panel" style={{
            maxWidth: 460,
            width: '100%',
            padding: 28,
            background: 'linear-gradient(145deg, rgba(17, 24, 43, 0.95), rgba(9, 13, 26, 0.98))',
            border: '1px solid var(--border-highlight)',
            position: 'relative'
          }}>
            {/* Holographic Watermark Badge */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 18 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--cyan)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                <Bus size={20} />
                <span>AURA CAMPUS TRANSIT AUTHORITY</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                SEMESTER BUS COMMUTER ACCESS PASS
              </div>
            </div>

            {/* QR Code Container */}
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                display: 'inline-block',
                background: '#ffffff',
                padding: 16,
                borderRadius: 16,
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
              }}>
                {/* Visual SVG QR representation */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 18px)', gridTemplateRows: 'repeat(7, 18px)', gap: 3 }}>
                  {Array.from({ length: 49 }).map((_, i) => {
                    const isCorner = (i <= 2 || (i >= 4 && i <= 6) || (i >= 42 && i <= 44));
                    const isSolid = (i % 2 === 0 || i % 5 === 0 || isCorner);
                    return (
                      <div 
                        key={i} 
                        style={{ 
                          background: isSolid ? '#0f172a' : '#ffffff',
                          borderRadius: isCorner ? 3 : 1
                        }} 
                      />
                    );
                  })}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary-light)', marginTop: 12, fontWeight: 600 }}>
                {passDetails.passNumber}
              </div>
            </div>

            {/* Pass Metadata */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.8rem', marginTop: 12, padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Student Commuter:</span>
                <div style={{ fontWeight: 700 }}>{passDetails.holderName}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Roll No:</span>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{passDetails.rollNo}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Authorized Route:</span>
                <div style={{ fontWeight: 600, color: 'var(--cyan)' }}>{passDetails.route}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Valid Through:</span>
                <div style={{ fontWeight: 700, color: 'var(--emerald)' }}>{passDetails.validThrough}</div>
              </div>
            </div>

            {renewSuccess && (
              <div style={{ marginTop: 14, padding: 10, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', fontSize: '0.8rem', textAlign: 'center' }}>
                ✓ Bus Pass renewed and extended through December 2027!
              </div>
            )}

            <button 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 20 }}
              disabled={isRenewing}
              onClick={handleRenewPass}
            >
              <RefreshCw size={15} className={isRenewing ? 'spin' : ''} />
              <span>{isRenewing ? 'Contacting Transit Board...' : 'Renew Pass For Next Semester'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Campus Fleet Routes Directory Tab */}
      {selectedRouteTab === 'directory' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>All University Transport Bus Routes</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Fleet covers all major railway junctions, metro corridors, and student residential zones.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transportData.allRoutes?.map((route) => (
              <div 
                key={route.route} 
                className="glass-card" 
                style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '0.95rem' }}>{route.route}</span>
                    <span style={{ fontWeight: 700 }}>{route.name}</span>
                    <span className={`badge ${route.status.includes('Active') ? 'badge-emerald' : 'badge-amber'}`}>
                      {route.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Bus: <span style={{ fontFamily: 'var(--font-mono)' }}>{route.busNo}</span> • Stops: {route.stopsCount} Waypoints • Operating: {route.timings}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right', fontSize: '0.78rem' }}>
                    <div style={{ fontWeight: 600 }}>Driver: {route.driver}</div>
                    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{route.driverPhone}</div>
                  </div>
                  <a 
                    href={`tel:${route.driverPhone}`}
                    className="btn btn-secondary btn-sm"
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
