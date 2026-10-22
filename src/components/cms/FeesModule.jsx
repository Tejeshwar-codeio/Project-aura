import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Printer, 
  X, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeesModule({ fees, onPayFee }) {
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState(fees?.pendingDue || 16500);
  const [selectedHeadId, setSelectedHeadId] = useState('');
  const [paymentMode, setPaymentMode] = useState('Instant UPI (Google Pay / PhonePe)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  if (!fees) return null;

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!payAmount || payAmount <= 0) return;

    setIsProcessing(true);
    try {
      const res = await fetch('http://localhost:5000/api/cms/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payAmount,
          headId: selectedHeadId || null,
          paymentMode
        })
      });

      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 90, spread: 65 });
        setShowPayModal(false);
        setActiveReceipt(data.receipt);
        if (onPayFee) onPayFee(data.updatedFees);
      } else {
        alert(data.error || 'Payment could not be completed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to payment gateway');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Dues Alert & Due Date Banner */}
      {fees.pendingDue > 0 ? (
        <div className="glass-panel" style={{
          padding: '18px 24px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(17, 24, 43, 0.7))',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.2)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--amber)' }}>
                Semester 6 Campus & Academic Dues Pending
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Final Due Date: <strong style={{ color: 'var(--text-primary)' }}>{fees.dueDate}</strong> (Late fee of ₹50/day applicable post deadline)
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setPayAmount(fees.pendingDue);
              setSelectedHeadId('');
              setShowPayModal(true);
            }}
          >
            <CreditCard size={16} />
            <span>Pay Dues Now (₹{fees.pendingDue})</span>
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{
          padding: '18px 24px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(17, 24, 43, 0.7))',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <CheckCircle size={28} color="var(--emerald)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--emerald)' }}>
              All Semester Dues Cleared! No Outstanding Balance
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Exam hall ticket and semester enrollment confirmed without holds.
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Total Semester Fee
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            ₹{fees.totalFee}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cyan)', marginTop: 4 }}>
            {fees.academicYear} • {fees.semester}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Total Fee Paid
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
            ₹{fees.paidAmount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: 4 }}>
            Verified via Accounts Section
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Pending Balance Due
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: fees.pendingDue > 0 ? 'var(--amber)' : 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
            ₹{fees.pendingDue}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Status: {fees.paymentStatus}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Award size={15} color="var(--primary-light)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase' }}>
              Scholarship Grant
            </span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>
            ₹{fees.scholarship?.awardedAmount || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {fees.scholarship?.name}
          </div>
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Semester Fee Breakdown & Head-wise Status</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official invoice schedule per University Syndicate guidelines</p>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            <span>Print Ledger</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Fee Head Description</th>
                <th style={{ padding: '10px 14px' }}>Total Amount</th>
                <th style={{ padding: '10px 14px' }}>Amount Paid</th>
                <th style={{ padding: '10px 14px' }}>Balance Due</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.breakdown.map((head) => (
                <tr key={head.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{head.head}</td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)' }}>₹{head.amount}</td>
                  <td style={{ padding: '14px', color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>₹{head.paid}</td>
                  <td style={{ padding: '14px', color: head.due > 0 ? 'var(--amber)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ₹{head.due}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${
                      head.status === 'Paid' ? 'badge-emerald' :
                      head.status === 'Partial' ? 'badge-amber' : 'badge-rose'
                    }`}>
                      {head.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {head.due > 0 ? (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedHeadId(head.id);
                          setPayAmount(head.due);
                          setShowPayModal(true);
                        }}
                      >
                        Pay Head
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--emerald)' }}>Cleared</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History & Receipt Slips */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>Payment Transaction History & Downloadable Receipts</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>All transactions are verified with cryptographic bank reference hashes</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fees.transactions.map((txn) => (
            <div 
              key={txn.txnId} 
              className="glass-card" 
              style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{txn.txnId}</span>
                  <span className="badge badge-emerald">{txn.status}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {txn.purpose} • {txn.mode}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Date: {new Date(txn.date).toLocaleDateString()} at {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                    ₹{txn.amount}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Receipt: {txn.receiptNo}
                  </div>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveReceipt(txn)}
                  title="View official receipt slip"
                >
                  <FileText size={15} />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPayModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-modal-backdrop)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 130,
          padding: 16
        }}>
          <div className="glass-panel" style={{ maxWidth: 480, width: '100%', padding: 24, position: 'relative' }}>
            <button 
              onClick={() => setShowPayModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div className="brand-icon-box" style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <CreditCard size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Aura Campus Fee Payment Gateway</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Secure Instant Clearance Portal (Simulated)</p>
              </div>
            </div>

            <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Payment Target Head
                </label>
                <select 
                  value={selectedHeadId} 
                  onChange={(e) => {
                    setSelectedHeadId(e.target.value);
                    if (e.target.value) {
                      const head = fees.breakdown.find(h => h.id === e.target.value);
                      if (head) setPayAmount(head.due);
                    } else {
                      setPayAmount(fees.pendingDue);
                    }
                  }}
                  className="glass-input" 
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  <option value="">Full Pending Dues Across All Heads (₹{fees.pendingDue})</option>
                  {fees.breakdown.filter(h => h.due > 0).map(h => (
                    <option key={h.id} value={h.id}>{h.head} (Due: ₹{h.due})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Payment Amount (₹) *
                </label>
                <input 
                  type="number" 
                  required
                  max={fees.pendingDue}
                  min={100}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="glass-input" 
                  style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Current Total Pending Balance: ₹{fees.pendingDue}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Choose Payment Gateway Channel
                </label>
                <select 
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="glass-input" 
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  <option value="Instant UPI (Google Pay / PhonePe / Paytm)">Instant UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Net Banking (HDFC / SBI / ICICI / Axis)">Net Banking (HDFC / SBI / ICICI / Axis)</option>
                  <option value="Debit / Credit Card (Visa / Mastercard / RuPay)">Debit / Credit Card (Visa / Mastercard / RuPay)</option>
                  <option value="Education Loan Direct Disbursement">Education Loan Direct Disbursement</option>
                </select>
              </div>

              <div style={{
                padding: 12,
                borderRadius: 8,
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: 8
              }}>
                <ShieldCheck size={18} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                <span>Zero transaction processing fee on student tuition accounts. Verified with instant college receipt generation.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPayModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-emerald"
                  disabled={isProcessing}
                >
                  <Sparkles size={16} />
                  <span>{isProcessing ? 'Verifying with Bank...' : `Authorize Payment (₹${payAmount})`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Fee Receipt Modal */}
      {activeReceipt && (
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
          <div className="glass-panel printable-area" style={{ maxWidth: 540, width: '100%', padding: 28, position: 'relative', background: '#0e1428', border: '1px solid var(--border-highlight)' }}>
            <button 
              onClick={() => setActiveReceipt(null)}
              className="no-print"
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {/* University Letterhead */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                AURA INSTITUTE OF TECHNOLOGY
              </h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ACCOUNTS & BURSAR DEPARTMENT • OFFICIAL E-RECEIPT
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.82rem', marginBottom: 18 }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Receipt No:</span>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{activeReceipt.receiptNo}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Ref:</span>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{activeReceipt.txnId}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Student Roll No:</span>
                <div style={{ fontWeight: 600 }}>23CSE104 (Aarav Sharma)</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <div style={{ fontWeight: 600 }}>{activeReceipt.mode}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                <div style={{ fontWeight: 600 }}>{new Date(activeReceipt.date).toLocaleString()}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <div style={{ fontWeight: 700, color: 'var(--emerald)' }}>VERIFIED SUCCESS</div>
              </div>
            </div>

            <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{activeReceipt.purpose}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>B.Tech Computer Science & Engineering - Semester 6</div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                  ₹{activeReceipt.amount}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              This is a computer generated verifiable receipt issued under the authority of Aura Campus ERP. No physical signature required.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }} className="no-print">
              <button 
                className="btn btn-secondary"
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print Official Slip</span>
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveReceipt(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
