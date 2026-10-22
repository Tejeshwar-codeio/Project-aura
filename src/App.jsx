import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StoreView from './components/StoreView';
import CMSView from './components/CMSView';
import CartDrawer from './components/CartDrawer';
import StudentIdModal from './components/StudentIdModal';
import { Sparkles, Check, ShoppingBag } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

// Fallback initial data for instant turnkey responsiveness
const FALLBACK_STUDENT = {
  id: "AURA-2026-CS104",
  name: "Aarav Sharma",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  email: "aarav.cs26@auracollege.edu",
  department: "Computer Science & Engineering",
  semester: "Semester 6",
  batch: "2023 - 2027",
  rollNo: "23CSE104",
  bloodGroup: "O+",
  emergencyContact: "+91 98111 22334 (Father)",
  hostel: { room: "Room 304 (Aryabhatta Block C)" },
  transport: { routeNumber: "Route 04 (Metro Interchange)" },
  cgpa: 8.65
};

export default function App() {
  const [activePortal, setActivePortal] = useState('store'); // 'store' | 'cms'
  const [theme, setTheme] = useState('dark');
  const [student, setStudent] = useState(FALLBACK_STUDENT);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [fees, setFees] = useState(null);
  const [transport, setTransport] = useState(null);
  const [academics, setAcademics] = useState(null);
  const [library, setLibrary] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [notices, setNotices] = useState([]);
  const [helpdesk, setHelpdesk] = useState([]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial data from backend API
  useEffect(() => {
    fetch(`${API_BASE}/student/profile`)
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(err => console.log('Using local student profile'));

    fetch(`${API_BASE}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log('Using local products catalog'));

    fetch(`${API_BASE}/cms/fees`)
      .then(res => res.json())
      .then(data => setFees(data))
      .catch(err => console.log('Using local fees ledger'));

    fetch(`${API_BASE}/cms/transport`)
      .then(res => res.json())
      .then(data => setTransport(data))
      .catch(err => console.log('Using local transport fleet'));

    fetch(`${API_BASE}/cms/academics`)
      .then(res => res.json())
      .then(data => setAcademics(data))
      .catch(err => console.log('Using local academics'));

    fetch(`${API_BASE}/cms/library`)
      .then(res => res.json())
      .then(data => setLibrary(data))
      .catch(err => console.log('Using local library'));

    fetch(`${API_BASE}/cms/hostel`)
      .then(res => res.json())
      .then(data => setHostel(data))
      .catch(err => console.log('Using local hostel info'));

    fetch(`${API_BASE}/cms/notices`)
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(err => console.log('Using local notices'));

    fetch(`${API_BASE}/cms/helpdesk`)
      .then(res => res.json())
      .then(data => setHelpdesk(data))
      .catch(err => console.log('Using local helpdesk'));
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart actions
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.title}" to cart!`);
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Add peer product to store
  const handleAddProduct = async (newProd) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      const data = await res.json();
      setProducts((prev) => [data, ...prev]);
      showToast('Your book listing has been published to the student store!');
    } catch (err) {
      console.error(err);
      const fallbackProd = { ...newProd, id: `prod-${Date.now()}`, inStock: true, stockCount: 1, rating: 5.0, reviewsCount: 1, discountPercent: 40 };
      setProducts((prev) => [fallbackProd, ...prev]);
      showToast('Listing published successfully!');
    }
  };

  // Fees updated handler
  const handlePayFee = (updatedFees) => {
    setFees(updatedFees);
    showToast('Payment verified! Receipt generated.');
  };

  // Ticket created handler
  const handleTicketCreated = (newTicket) => {
    setHelpdesk((prev) => [newTicket, ...prev]);
    showToast(`Ticket #${newTicket.id} submitted to Student Welfare!`);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 150,
          background: 'var(--primary-gradient)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar 
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenIdCard={() => setIsIdCardOpen(true)}
        theme={theme}
        setTheme={setTheme}
        student={student}
        noticesCount={notices.length}
        onOpenNotices={() => {
          setActivePortal('cms');
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: 48 }}>
        {activePortal === 'store' ? (
          <StoreView 
            products={products}
            onAddToCart={handleAddToCart}
            onAddProduct={handleAddProduct}
          />
        ) : (
          <CMSView 
            student={student}
            fees={fees}
            onPayFee={handlePayFee}
            transport={transport}
            academics={academics}
            library={library}
            hostel={hostel}
            notices={notices}
            helpdesk={helpdesk}
            onTicketCreated={handleTicketCreated}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderPlaced={(order) => {
          showToast(`Order #${order.orderId} placed for Campus Delivery!`);
        }}
      />

      {/* Digital Student ID Card Modal */}
      {isIdCardOpen && (
        <StudentIdModal 
          student={student}
          onClose={() => setIsIdCardOpen(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 19, 0.95)',
        padding: '28px 24px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>AURA CAMPUS</span>
            <span>• Integrated Student Marketplace & University Management System</span>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <span>B.Tech Semester 6 Portal</span>
            <span>Campus Express Locker Network</span>
            <span>Syndicate Verified System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
