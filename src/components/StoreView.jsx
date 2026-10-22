import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingBag, 
  Plus, 
  Sparkles, 
  Check, 
  Tag, 
  Clock, 
  ShieldCheck, 
  Share2, 
  ArrowUpDown,
  BookOpen,
  Package,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

export default function StoreView({ 
  products, 
  onAddToCart, 
  onAddProduct,
  departments = []
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    author: '',
    category: 'Peer-to-Peer Store',
    department: 'Computer Science',
    price: '',
    originalPrice: '',
    condition: 'Like New (Minimal Highlights)',
    description: ''
  });

  const categories = [
    { label: 'All Items', value: 'All' },
    { label: '📚 Textbooks', value: 'Textbooks' },
    { label: '📖 Study Guides', value: 'Study Guides' },
    { label: '✒️ Stationery', value: 'Stationery' },
    { label: '🔬 Lab Equipment', value: 'Lab Equipment' },
    { label: '🔢 Electronics', value: 'Electronics' },
    { label: '🔄 Peer Resale', value: 'Peer-to-Peer Store' }
  ];

  // Filtering & Sorting
  const filteredProducts = products.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchDept = selectedDept === 'All' || item.department.toLowerCase().includes(selectedDept.toLowerCase()) || item.department === 'All Students';
    const matchStock = !inStockOnly || item.inStock;
    const matchSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    return matchCategory && matchDept && matchStock && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return 0;
  });

  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!newListing.title || !newListing.price) return;
    onAddProduct(newListing);
    setShowSellModal(false);
    setNewListing({
      title: '',
      author: '',
      category: 'Peer-to-Peer Store',
      department: 'Computer Science',
      price: '',
      originalPrice: '',
      condition: 'Like New (Minimal Highlights)',
      description: ''
    });
  };

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      {/* Hero Showcase Banner */}
      <div className="glass-panel" style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 32,
        padding: '36px 32px',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        background: 'linear-gradient(135deg, rgba(17, 24, 43, 0.95), rgba(9, 13, 26, 0.98))'
      }}>
        {/* Ambient neon backdrop */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -50,
          left: 100,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ maxWidth: 650 }}>
            <div className="badge badge-primary" style={{ marginBottom: 12 }}>
              <Sparkles size={13} />
              <span>Official Student Co-Op Store</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
              Everything For Your Semester in One Place
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: 20 }}>
              Order university-prescribed textbooks, GATE & semester exam guides, drafting pencils, lab coats, and electronics with instant delivery directly to your hostel room or campus locker.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--emerald)' }}>
                <Check size={16} /> <span>2-Hour Hostel Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--cyan)' }}>
                <Check size={16} /> <span>Student Subsidized Pricing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--amber)' }}>
                <Check size={16} /> <span>Junior-Senior Peer Resale</span>
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              className="btn btn-primary"
              style={{ padding: '14px 22px', fontSize: '0.95rem' }}
              onClick={() => setShowSellModal(true)}
            >
              <Plus size={18} />
              <span>Sell Your Used Books / Notes</span>
            </button>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Pass your notes to juniors & earn cash instantly
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search books, authors, pens, scientific calculators, lab kits..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: 42 }}
            />
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Dept:</span>
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science & IT</option>
              <option value="Competitive Exams">Competitive Exams (GATE/GRE)</option>
              <option value="Mechanical & Civil">Mechanical & Civil</option>
              <option value="Chemistry & Biotech">Chemistry & Biotech</option>
              <option value="All Engineering">All Engineering</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="featured">Featured & Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated by Students</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          {/* In Stock Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              checked={inStockOnly} 
              onChange={(e) => setInStockOnly(e.target.checked)} 
              style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedCategory === cat.value ? 'var(--primary)' : 'var(--border-subtle)',
                background: selectedCategory === cat.value ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-subtle)',
                color: selectedCategory === cat.value ? 'var(--primary-light)' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Current Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>
          Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filteredProducts.length}</span> student products
        </div>
        <div>
          Campus Express Delivery Available Today
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid-cols-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="glass-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Top Badges */}
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', gap: 6 }}>
              {product.badge && (
                <span className={`badge ${
                  product.badge === 'Bestseller' ? 'badge-primary' :
                  product.badge === 'Exam Essential' ? 'badge-rose' :
                  product.badge === 'Student Resale' ? 'badge-amber' : 'badge-cyan'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Discount Pill */}
            {product.discountPercent > 0 && (
              <span 
                className="badge badge-emerald" 
                style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
              >
                {product.discountPercent}% OFF
              </span>
            )}

            {/* Product Image */}
            <div 
              style={{ 
                height: 200, 
                overflow: 'hidden', 
                background: 'rgba(0,0,0,0.3)',
                cursor: 'pointer' 
              }}
              onClick={() => setSelectedProduct(product)}
            >
              <img 
                src={product.image} 
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              />
            </div>

            {/* Product Body */}
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                {product.category} • {product.department}
              </div>

              <h3 
                style={{ 
                  fontSize: '0.98rem', 
                  fontWeight: 700, 
                  lineHeight: 1.35, 
                  marginBottom: 6, 
                  cursor: 'pointer',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
                onClick={() => setSelectedProduct(product)}
                title={product.title}
              >
                {product.title}
              </h3>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                By {product.author || product.seller}
              </div>

              {/* Rating and Stock */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--amber)' }}>
                  <Star size={14} fill="var(--amber)" />
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount})</span>
                </div>

                <div style={{ color: product.inStock ? 'var(--emerald)' : 'var(--rose)', fontWeight: 600 }}>
                  {product.inStock ? `● ${product.stockCount} in stock` : '● Out of stock'}
                </div>
              </div>

              {/* Price & Action */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {product.condition}
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  disabled={!product.inStock}
                  onClick={() => onAddToCart(product)}
                  style={{ opacity: product.inStock ? 1 : 0.5 }}
                >
                  <ShoppingBag size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sell Your Used Book Modal */}
      {showSellModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-modal-backdrop)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: 16
        }}>
          <div className="glass-panel" style={{ maxWidth: 540, width: '100%', padding: 24, position: 'relative' }}>
            <button 
              onClick={() => setShowSellModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="brand-icon-box" style={{ width: 36, height: 36 }}>
                <BookOpen size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>List Used Book / Student Gear</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sell directly to your juniors with hostel or canteen handoff</p>
              </div>
            </div>

            <form onSubmit={handleSellSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Product / Book Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Database System Concepts (6th Edition)" 
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="glass-input" 
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Author / Brand
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Silberschatz" 
                    value={newListing.author}
                    onChange={(e) => setNewListing({ ...newListing, author: e.target.value })}
                    className="glass-input" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Department
                  </label>
                  <select 
                    value={newListing.department}
                    onChange={(e) => setNewListing({ ...newListing, department: e.target.value })}
                    className="glass-input" 
                    style={{ width: '100%' }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil & Biotech">Civil & Biotech</option>
                    <option value="All Students">General / All</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Your Asking Price (₹) *
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 350" 
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    className="glass-input" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Original Store Price (₹)
                  </label>
                  <input 
                    type="number" 
                    placeholder="e.g. 799" 
                    value={newListing.originalPrice}
                    onChange={(e) => setNewListing({ ...newListing, originalPrice: e.target.value })}
                    className="glass-input" 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Condition
                </label>
                <select 
                  value={newListing.condition}
                  onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                  className="glass-input" 
                  style={{ width: '100%' }}
                >
                  <option value="Like New (Unmarked Pages)">Like New (Unmarked Pages)</option>
                  <option value="Good (Includes Helpful Exam Notes)">Good (Includes Helpful Exam Notes)</option>
                  <option value="Fair / Usable">Fair / Usable</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Description & Handoff Location
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Has all solved mid-term papers inside. Can hand over at Aryabhatta Hostel or Central Library."
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="glass-input" 
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowSellModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Student Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-modal-backdrop)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: 16
        }}>
          <div className="glass-panel" style={{ maxWidth: 700, width: '100%', padding: 24, position: 'relative' }}>
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24 }}>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: 280, background: 'rgba(0,0,0,0.4)' }}>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
                  {selectedProduct.category}
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
                  {selectedProduct.title}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  By <strong style={{ color: 'var(--text-primary)' }}>{selectedProduct.author || selectedProduct.seller}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--amber)' }}>
                    <Star size={16} fill="var(--amber)" />
                    <span style={{ fontWeight: 700 }}>{selectedProduct.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({selectedProduct.reviewsCount} student reviews)</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <div style={{ color: 'var(--cyan)', fontSize: '0.82rem' }}>
                    {selectedProduct.department}
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
                  {selectedProduct.description}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        ₹{selectedProduct.price}
                      </span>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                          ₹{selectedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--emerald)' }}>
                      Inclusive of all student subsidies
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
