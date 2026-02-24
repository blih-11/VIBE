# VIBEWEAR — Setup Guide

## First-Time Setup (run once)

```bash
# 1. Install all dependencies (both client and server)
npm run setup

# 2. Seed the database with products
npm run seed
```

## Running the App

```bash
# Starts both the Vite frontend (port 5173) and Express server (port 4000)
npm run dev
```

Then open: **http://localhost:5173**

Admin panel: **http://localhost:5173/admin-login**
- Username: `vibewear`
- Password: `Admin@123!`

---

## What Was Fixed

1. **`server/.env`** — Filled in real MongoDB URI and admin credentials
2. **`Products.jsx`** — Now fetches live products from the API instead of static hardcoded data
3. **`Home.jsx`** — Now fetches live products from the API with loading skeletons
4. **`ProductDetail.jsx`** — Now fetches from API using MongoDB `_id`; shows loading state
5. **`ProductCard.jsx`** — Fixed navigation to use `_id` (MongoDB) instead of `id` (static)
6. **`CartContext.jsx`** — Fixed cart keying to use `_id` so add-to-cart works for DB products
7. **`SearchModal.jsx`** — Now searches live products from the API
8. **`package.json`** — Fixed `dev` script so server runs from its own directory and finds its dependencies; added `setup` and `seed` scripts
