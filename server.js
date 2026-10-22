const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const initialData = require('./data/initialData');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-Memory & Local JSON Document Store
let db = {};

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(raw);
      console.log(' [Database] Loaded existing database from db.json');
    } else {
      db = JSON.parse(JSON.stringify(initialData));
      saveDb();
      console.log(' [Database] Initialized new database with comprehensive campus data');
    }
  } catch (err) {
    console.error(' [Database] Failed to read db.json, resetting to initialData', err);
    db = JSON.parse(JSON.stringify(initialData));
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error(' [Database] Error saving db.json', err);
  }
}

loadDb();

// -----------------------------------------------------------------------------
// Health Check & Root Info
// -----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Aura Campus ERP & Student Store API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    records: {
      products: db.products ? db.products.length : 0,
      orders: db.orders ? db.orders.length : 0,
      notices: db.notices ? db.notices.length : 0
    }
  });
});

// -----------------------------------------------------------------------------
// STUDENT PROFILE
// -----------------------------------------------------------------------------
app.get('/api/student/profile', (req, res) => {
  res.json(db.student);
});

app.put('/api/student/profile', (req, res) => {
  const updates = req.body;
  db.student = { ...db.student, ...updates };
  saveDb();
  res.json({ success: true, message: 'Profile updated successfully', student: db.student });
});

// -----------------------------------------------------------------------------
// STUDENT STORE (E-COMMERCE) PRODUCTS
// -----------------------------------------------------------------------------
app.get('/api/products', (req, res) => {
  let results = [...(db.products || [])];
  const { category, department, search, sort, inStockOnly } = req.query;

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (department && department !== 'All') {
    results = results.filter(p => p.department.toLowerCase().includes(department.toLowerCase()) || p.department === 'All Students');
  }

  if (inStockOnly === 'true') {
    results = results.filter(p => p.inStock);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount') {
    results.sort((a, b) => b.discountPercent - a.discountPercent);
  }

  res.json(results);
});

app.get('/api/products/:id', (req, res) => {
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Student sell/resale used books or listing
app.post('/api/products', (req, res) => {
  const { title, author, category, price, originalPrice, description, condition, department, image } = req.body;
  if (!title || !price) {
    return res.status(400).json({ error: 'Title and price are required' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    title,
    author: author || 'Student Seller',
    category: category || 'Peer-to-Peer Store',
    department: department || 'All Students',
    price: Number(price),
    originalPrice: Number(originalPrice || price * 1.5),
    discountPercent: Math.round(((Number(originalPrice || price * 1.5) - Number(price)) / Number(originalPrice || price * 1.5)) * 100),
    rating: 5.0,
    reviewsCount: 1,
    inStock: true,
    stockCount: 1,
    condition: condition || 'Pre-loved Used Book',
    seller: db.student.name + ` (${db.student.rollNo})`,
    image: image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    description: description || 'Verified student peer listing on Aura Campus.',
    badge: 'Student Resale',
    tags: ['Student Marketplace', 'Verified']
  };

  db.products.unshift(newProduct);
  saveDb();
  res.status(201).json(newProduct);
});

// Submit review
app.post('/api/products/:id/review', (req, res) => {
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { rating, comment, studentName } = req.body;
  product.reviewsCount = (product.reviewsCount || 0) + 1;
  product.rating = Number((((product.rating || 5) * (product.reviewsCount - 1) + Number(rating || 5)) / product.reviewsCount).toFixed(1));

  saveDb();
  res.json({ success: true, product });
});

// -----------------------------------------------------------------------------
// ORDERS & CHECKOUT
// -----------------------------------------------------------------------------
app.get('/api/orders', (req, res) => {
  res.json(db.orders || []);
});

app.post('/api/orders', (req, res) => {
  const { items, deliveryType, paymentMode, couponCode } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart items cannot be empty' });
  }

  let subtotal = 0;
  items.forEach(item => {
    subtotal += (item.price || 0) * (item.quantity || 1);
  });

  // Calculate discount based on coupons
  let discountAmount = 0;
  if (couponCode === 'AURA10') {
    discountAmount = Math.round(subtotal * 0.10);
  } else if (couponCode === 'SCHOLAR25') {
    discountAmount = Math.min(250, Math.round(subtotal * 0.25));
  } else if (couponCode === 'FREESHIP') {
    discountAmount = 50;
  }

  const finalPaid = Math.max(0, subtotal - discountAmount);
  const orderId = `AURA-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder = {
    orderId,
    date: new Date().toISOString(),
    items,
    totalAmount: subtotal,
    discountAmount,
    couponApplied: couponCode || null,
    finalPaid,
    paymentMode: paymentMode || 'UPI / Instant Payment',
    deliveryType: deliveryType || 'Hostel Delivery (Room C-304)',
    status: 'Confirmed & Packing',
    estimatedDelivery: 'Within 2 hours (Campus Express)',
    invoiceUrl: `#invoice-${orderId}`
  };

  db.orders.unshift(newOrder);

  // Decrement stock counts
  items.forEach(cartItem => {
    const prod = (db.products || []).find(p => p.id === cartItem.id);
    if (prod && prod.stockCount > 0) {
      prod.stockCount = Math.max(0, prod.stockCount - cartItem.quantity);
      if (prod.stockCount === 0) prod.inStock = false;
    }
  });

  saveDb();
  res.status(201).json({ success: true, order: newOrder });
});

// -----------------------------------------------------------------------------
// COLLEGE MANAGEMENT SYSTEM (CMS) - FEES
// -----------------------------------------------------------------------------
app.get('/api/cms/fees', (req, res) => {
  res.json(db.fees);
});

app.post('/api/cms/fees/pay', (req, res) => {
  const { amount, headId, paymentMode } = req.body;
  const payAmt = Number(amount);

  if (!payAmt || payAmt <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  if (payAmt > db.fees.pendingDue) {
    return res.status(400).json({ error: `Amount exceeds current total due of ₹${db.fees.pendingDue}` });
  }

  const txnId = `TXN-AURA-${Math.floor(100000 + Math.random() * 900000)}`;
  const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Update breakdown
  let remainingToAllocate = payAmt;
  if (headId) {
    const targetHead = db.fees.breakdown.find(h => h.id === headId);
    if (targetHead) {
      const allocate = Math.min(targetHead.due, remainingToAllocate);
      targetHead.paid += allocate;
      targetHead.due -= allocate;
      targetHead.status = targetHead.due === 0 ? 'Paid' : 'Partial';
      remainingToAllocate -= allocate;
    }
  }

  // If general payment, allocate down the unpaid heads
  if (remainingToAllocate > 0) {
    for (const head of db.fees.breakdown) {
      if (head.due > 0 && remainingToAllocate > 0) {
        const canPay = Math.min(head.due, remainingToAllocate);
        head.paid += canPay;
        head.due -= canPay;
        head.status = head.due === 0 ? 'Paid' : 'Partial';
        remainingToAllocate -= canPay;
      }
    }
  }

  // Update overall totals
  db.fees.paidAmount += payAmt;
  db.fees.pendingDue = Math.max(0, db.fees.pendingDue - payAmt);
  db.fees.paymentStatus = db.fees.pendingDue === 0 ? 'Fully Cleared' : 'Partial Paid';

  const newTxn = {
    txnId,
    date: new Date().toISOString(),
    amount: payAmt,
    mode: paymentMode || 'Instant UPI / Card Portal',
    purpose: headId ? 'Specific Head Fee Payment' : 'Semester 6 Academic & Campus Dues',
    receiptNo,
    status: 'Success'
  };

  db.fees.transactions.unshift(newTxn);
  saveDb();

  res.json({
    success: true,
    message: 'Fee payment processed and verified successfully!',
    receipt: newTxn,
    updatedFees: db.fees
  });
});

// -----------------------------------------------------------------------------
// COLLEGE MANAGEMENT SYSTEM (CMS) - TRANSPORTATION
// -----------------------------------------------------------------------------
app.get('/api/cms/transport', (req, res) => {
  res.json(db.transport);
});

// Live Bus Telemetry Simulation
app.get('/api/cms/transport/live-bus', (req, res) => {
  const baseRoute = db.transport.studentRoute;
  const now = Date.now();
  // Simulate speed fluctuations and progress
  const simulatedSpeed = Math.floor(28 + Math.sin(now / 5000) * 12);
  const etaFluctuation = Math.max(2, Math.floor(7 - ((now / 15000) % 6)));
  const dynamicOccupancy = 32 + Math.floor(Math.sin(now / 10000) * 4);

  res.json({
    ...baseRoute,
    currentSpeedKmH: simulatedSpeed,
    etaToStudentStopMin: etaFluctuation,
    occupiedSeats: dynamicOccupancy,
    availableSeats: baseRoute.totalCapacity - dynamicOccupancy,
    lastPing: new Date().toISOString()
  });
});

app.post('/api/cms/transport/renew-pass', (req, res) => {
  const { semesterExtension } = req.body;
  db.transport.passDetails.validThrough = '31 Dec 2027';
  db.transport.passDetails.qrCodeData = `AURA_TRANSPORT_VERIFIED_23CSE104_ROUTE04_EXP2027_RENEWED_${Date.now()}`;
  db.transport.passDetails.status = 'Renewed & Active';
  saveDb();
  res.json({ success: true, message: 'Campus Bus Pass renewed successfully for next semester!', pass: db.transport.passDetails });
});

// -----------------------------------------------------------------------------
// COLLEGE MANAGEMENT SYSTEM (CMS) - ACADEMICS & ATTENDANCE
// -----------------------------------------------------------------------------
app.get('/api/cms/academics', (req, res) => {
  res.json(db.academics);
});

app.post('/api/cms/academics/apply-leave', (req, res) => {
  const { subjectCode, reason, fromDate, toDate } = req.body;
  if (!reason || !fromDate) {
    return res.status(400).json({ error: 'Reason and dates are mandatory' });
  }

  res.json({
    success: true,
    message: 'Leave application submitted to Head of Department (Dr. K. S. Raman). Attendance waiver pending approval.',
    applicationId: `LEAVE-AURA-${Math.floor(1000 + Math.random() * 9000)}`
  });
});

// -----------------------------------------------------------------------------
// COLLEGE MANAGEMENT SYSTEM (CMS) - LIBRARY
// -----------------------------------------------------------------------------
app.get('/api/cms/library', (req, res) => {
  res.json(db.library);
});

app.post('/api/cms/library/renew/:id', (req, res) => {
  const book = (db.library.borrowedBooks || []).find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Borrowed book record not found' });

  // Extend due date by 14 days
  const future = new Date();
  future.setDate(future.getDate() + 14);
  book.dueDate = future.toISOString().split('T')[0];
  book.daysRemaining = 14;
  book.status = 'Renewed';
  book.fineAccumulated = 0;

  saveDb();
  res.json({ success: true, message: `"${book.title}" renewed for 14 days!`, book });
});

app.post('/api/cms/library/reserve', (req, res) => {
  const { bookId } = req.body;
  const catalogItem = (db.library.catalog || []).find(c => c.id === bookId);
  if (!catalogItem) return res.status(404).json({ error: 'Book not found in library catalogue' });

  if (catalogItem.copiesAvailable <= 0) {
    return res.status(400).json({ error: 'No physical copies available for reservation right now' });
  }

  catalogItem.copiesAvailable -= 1;
  saveDb();
  res.json({
    success: true,
    message: `Reservation token generated for "${catalogItem.title}". Please collect from ${catalogItem.floor} within 48 hours.`,
    reservationId: `RES-LIB-${Math.floor(10000 + Math.random() * 90000)}`
  });
});

// -----------------------------------------------------------------------------
// COLLEGE MANAGEMENT SYSTEM (CMS) - HOSTEL & MESS
// -----------------------------------------------------------------------------
app.get('/api/cms/hostel', (req, res) => {
  res.json(db.hostelMess);
});

app.post('/api/cms/hostel/mess-rebate', (req, res) => {
  const { days, reason } = req.body;
  const numDays = Number(days || 1);

  if (numDays > db.hostelMess.messRebateDaysAvailable) {
    return res.status(400).json({ error: `You only have ${db.hostelMess.messRebateDaysAvailable} mess rebate days available this semester` });
  }

  db.hostelMess.messRebateDaysAvailable -= numDays;
  saveDb();

  res.json({
    success: true,
    message: `Mess rebate approved for ${numDays} days. Credit will be deducted from next mess bill.`,
    remainingRebateDays: db.hostelMess.messRebateDaysAvailable
  });
});

// -----------------------------------------------------------------------------
// NOTICES & ANNOUNCEMENTS
// -----------------------------------------------------------------------------
app.get('/api/cms/notices', (req, res) => {
  res.json(db.notices || []);
});

// -----------------------------------------------------------------------------
// HELPDESK & GRIEVANCES
// -----------------------------------------------------------------------------
app.get('/api/cms/helpdesk', (req, res) => {
  res.json(db.helpdeskTickets || []);
});

app.post('/api/cms/helpdesk', (req, res) => {
  const { category, subject, description } = req.body;
  if (!subject) return res.status(400).json({ error: 'Subject is required' });

  const newTicket = {
    id: `TKT-AURA-${Math.floor(1000 + Math.random() * 9000)}`,
    category: category || 'General Campus',
    subject,
    date: new Date().toISOString().split('T')[0],
    status: 'Open',
    assignedTo: 'Student Grievance Cell',
    lastUpdate: 'Ticket received and queued for department investigation.'
  };

  db.helpdeskTickets.unshift(newTicket);
  saveDb();
  res.status(201).json({ success: true, ticket: newTicket });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🎓 AURA CAMPUS ERP & STUDENT STORE BACKEND STARTED`);
  console.log(`  🌐 Server running on: http://localhost:${PORT}`);
  console.log(`  📦 Endpoints ready: /api/products, /api/cms/fees, /api/cms/transport, /api/academics`);
  console.log(`=======================================================`);
});
