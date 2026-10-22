import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  FileText,
  Truck,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryType, setDeliveryType] = useState('Hostel Delivery (Aryabhatta Block C - Room 304)');
  const [paymentMode, setPaymentMode] = useState('UPI (Google Pay / PhonePe)');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  // Totals calculation
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon === 'AURA10') {
    discount = Math.round(subtotal * 0.10);
  } else if (appliedCoupon === 'SCHOLAR25') {
    discount = Math.min(250, Math.round(subtotal * 0.25));
  } else if (appliedCoupon === 'FREESHIP') {
    discount = 50;
  }

  const shipping = appliedCoupon === 'FREESHIP' || subtotal > 500 ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURA10' || clean === 'SCHOLAR25' || clean === 'FREESHIP') {
      setAppliedCoupon(clean);
      setCouponCode(clean);
    } else {
      alert('Invalid coupon code. Try AURA10, SCHOLAR25, or FREESHIP');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          deliveryType,
          paymentMode,
          couponCode: appliedCoupon
        })
      });

      const data = await res.json();
      if (data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setCompletedOrder(data.order);
        onClearCart();
        if (onOrderPlaced) onOrderPlaced(data.order);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      // Fallback local order placement if server is sleeping
      const dummyOrder = {
        orderId: `AURA-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString(),
        items: cart,
        totalAmount: subtotal,
        discountAmount: discount,
        finalPaid: grandTotal,
        paymentMode,
        deliveryType,
        status: 'Confirmed & Packing',
        estimatedDelivery: 'Within 2 hours (Campus Express)'
      };
      confetti({ particleCount: 80, spread: 60 });
      setCompletedOrder(dummyOrder);
      onClearCart();
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 120,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: 520,
        height: '100%',
        borderRadius: 0,
        borderLeft: '1px solid var(--border-subtle)',
        borderTop: 'none',
        borderBottom: 'none',
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        background: 'var(--bg-card-solid)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-icon-box" style={{ width: 36, height: 36 }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Student Shopping Cart</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cart.length} items in your basket</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Order Confirmed Success Screen */}
        {completedOrder ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>
              Order Placed Successfully!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Your order <strong style={{ color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>{completedOrder.orderId}</strong> has been sent to the Campus Fulfillment Hub.
            </p>

            <div className="glass-card" style={{ width: '100%', padding: 16, textAlign: 'left', marginBottom: 24, fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Destination:</span>
                <span style={{ fontWeight: 600 }}>{completedOrder.deliveryType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <span style={{ fontWeight: 600 }}>{completedOrder.paymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
                <span style={{ fontWeight: 600, color: 'var(--emerald)' }}>{completedOrder.estimatedDelivery || 'Within 2 Hours'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 700 }}>Total Amount Paid:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>₹{completedOrder.finalPaid}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setCompletedOrder(null);
                onClose();
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <ShoppingBag size={56} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 6 }}>Your Cart is Empty</div>
            <p style={{ fontSize: '0.82rem', textAlign: 'center', maxWidth: 280, marginBottom: 20 }}>
              Browse through our campus catalog for engineering books, exam guides, pens, and scientific calculators.
            </p>
            <button className="btn btn-secondary" onClick={onClose}>
              Explore Store
            </button>
          </div>
        ) : (
          /* Cart Items & Checkout Workflow */
          <>
            {/* Scrollable Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="glass-card"
                  style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      ₹{item.price} each
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-subtle)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          style={{ padding: '2px 8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '2px 8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
                        ₹{item.price * item.quantity}
                      </span>

                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--rose)', cursor: 'pointer', padding: 4 }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Destination Option */}
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <MapPin size={14} color="var(--cyan)" />
                  <span>Campus Delivery Location:</span>
                </label>
                <select 
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                >
                  <option value="Hostel Delivery (Aryabhatta Block C - Room 304)">Hostel Delivery (Aryabhatta Block C - Room 304)</option>
                  <option value="Campus Smart Locker #14 (Library Ground Floor)">Campus Smart Locker #14 (Library Ground Floor)</option>
                  <option value="CSE Department Faculty / Staff Desk Pickup">CSE Department Staff Desk Pickup</option>
                  <option value="Central Canteen Handoff Counter">Central Canteen Handoff Counter</option>
                  <option value="Off-Campus Local Address">Off-Campus Day Scholar Home Address</option>
                </select>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <CreditCard size={14} color="var(--primary-light)" />
                  <span>Payment Method:</span>
                </label>
                <select 
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe)</option>
                  <option value="Student Campus Card / Digital Wallet">Student Campus Card / Digital Wallet</option>
                  <option value="Net Banking (SBI / HDFC / ICICI)">Net Banking (SBI / HDFC / ICICI)</option>
                  <option value="Cash on Campus Handoff">Cash on Campus Handoff</option>
                </select>
              </div>

              {/* Coupon Code Section */}
              <div style={{ marginTop: 8, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Coupon code (e.g. AURA10)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="glass-input"
                    style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem' }}
                  />
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => applyPromo(couponCode)}
                  >
                    Apply
                  </button>
                </div>

                {/* Clickable Quick Promos */}
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <span 
                    onClick={() => applyPromo('AURA10')}
                    style={{ fontSize: '0.7rem', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)', border: '1px dashed var(--primary)' }}
                  >
                    🏷️ AURA10 (10% Off)
                  </span>
                  <span 
                    onClick={() => applyPromo('SCHOLAR25')}
                    style={{ fontSize: '0.7rem', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', border: '1px dashed var(--emerald)' }}
                  >
                    🎓 SCHOLAR25 (25% Off)
                  </span>
                  <span 
                    onClick={() => applyPromo('FREESHIP')}
                    style={{ fontSize: '0.7rem', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', border: '1px dashed var(--cyan)' }}
                  >
                    🚚 FREESHIP
                  </span>
                </div>
              </div>
            </div>

            {/* Bill Summary & Sticky Checkout */}
            <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald)' }}>
                  <span>Student Discount ({appliedCoupon}):</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>- ₹{discount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Campus Express Delivery:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {shipping === 0 ? <strong style={{ color: 'var(--emerald)' }}>FREE</strong> : `₹${shipping}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <span>Total Amount:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{grandTotal}</span>
              </div>

              <button 
                className="btn btn-primary btn-lg"
                style={{ marginTop: 8, width: '100%' }}
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                <Sparkles size={18} />
                <span>{isCheckingOut ? 'Processing Order...' : `Place Campus Order (₹${grandTotal})`}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
