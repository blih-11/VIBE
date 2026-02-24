import dotenv from 'dotenv';
import { dirname as _dirname, join as _join } from 'path';
import { fileURLToPath as _ftu } from 'url';
dotenv.config({ path: _join(_dirname(_ftu(import.meta.url)), '.env') });
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import adminAuthRoutes from './routes/auth.js';
import productRoutes   from './routes/products.js';
import analyticsRoutes from './routes/analytics.js';
import { requireAdmin } from './middleware/adminAuth.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve product images statically (public — no auth needed)
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// ── Routes ───────────────────────────────────────────────────────────────────
// Public: admin login & token verify
app.use('/api/admin', adminAuthRoutes);

// Public: read products (storefront needs this)
app.get('/api/products',     (req, res, next) => next(), ...[]); // handled below
app.get('/api/products/:id', (req, res, next) => next(), ...[]); // handled below

// Protected: write operations on products require admin JWT
app.use('/api/products',  (req, res, next) => {
  if (req.method === 'GET') return next(); // reads are public
  requireAdmin(req, res, next);            // writes require JWT
}, productRoutes);

// Protected: all analytics require admin JWT
app.use('/api/analytics', requireAdmin, analyticsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
