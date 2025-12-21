# 🚀 Vercel Deployment Guide

## What is career.db? 🗄️

`career.db` is your SQLite database that stores:
- **👤 User accounts**: name, email, encrypted passwords, gender
- **🔐 Password resets**: email, reset codes, timestamps

### The Problem with SQLite on Vercel ⚠️
- Vercel uses **serverless functions** (ephemeral containers)
- Each deployment creates new containers
- SQLite files are **lost on every restart**
- Users would lose their accounts after each deployment! 😱

### The Solution: PostgreSQL ✅
- **Vercel production**: Uses PostgreSQL - persistent storage

### 1. Create PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
# Storage → Create Database → Postgres
# Note

This project no longer uses Vercel. Please refer to README.md for current deployment options (Railway, Render, Fly.io).

def get_db():
    if USE_POSTGRES:
        # PostgreSQL on Vercel (persistent)
        return psycopg2.connect(DATABASE_URL)
    else:
        # SQLite locally (easy setup)
        return sqlite3.connect('career.db')
```

**Local development:**
- No DATABASE_URL → Uses SQLite
- Run `python app.py` → Works instantly!

**Vercel production:**
- DATABASE_URL set → Uses PostgreSQL
- Data persists across deployments ✅

---

## 🎨 Mind-Blowing Theme Toggle

The new toggle features:
- **60x60px** circular morphing button
- **Animated gradient** background (5 colors cycling)
- **Glowing effects** with pulsing shadows
- **3D transforms** on hover/click
- **Morphing border-radius** animation
- **Different animations** for light/dark modes:
  - Light: Cool blue gradient with pulse
  - Dark: Warm gold/orange gradient with fiery glow

### CSS Animations:
- `gradientShift`: 8s infinite background animation
- `glowPulse`: 3s pulsing shadow (light mode)
- `moonGlow`: 3s fiery glow (dark mode)
- `morphBounce`: 4s shape morphing

---

## 🧪 Testing Locally Before Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally (uses SQLite)
python app.py

# Visit http://localhost:5000
# Create test accounts, they persist in career.db
```

---

## 🐛 Troubleshooting

**PostgreSQL connection errors:**
```bash
# Check DATABASE_URL format:
postgresql://username:password@host:5432/database_name

# Verify psycopg2 is installed:
pip list | grep psycopg2
```

**Theme toggle not animating:**
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors
- Verify styles.css loaded correctly

**Users losing accounts:**
- Verify DATABASE_URL is set in Vercel
- Check environment variables are in "Production" scope
- Redeploy after setting variables

---

## 📊 Database Schema

Both SQLite and PostgreSQL use the same schema:

**users table:**
```sql
id (SERIAL/INTEGER PRIMARY KEY)
name TEXT
email TEXT UNIQUE
pw_hash TEXT
gender TEXT
created_at TEXT
```

**resets table:**
```sql
email TEXT
code TEXT
created_at TEXT
```

---

## 🎯 Recommended: Vercel Postgres

Best option for this app:
- ✅ Integrated with Vercel
- ✅ Automatic backups
- ✅ Free tier available
- ✅ Zero latency (same region)
- ✅ One-click setup

---

**🎉 Your app is now production-ready with persistent data storage!**
