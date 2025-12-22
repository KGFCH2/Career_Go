# 📚 Career Go - Technical Documentation

> 🔧 **Complete technical guide for developers**

## 📑 Table of Contents

1. [🌟 Overview](#overview)
2. [🛠️ Environment Setup](#environment-setup)
3. [⚙️ Configuration](#configuration)
4. [🚀 Running the Application](#running-the-application)
5. [💾 Database](#database)
6. [🔌 API Endpoints](#api-endpoints)
7. [📊 Data Files](#data-files)
8. [🔒 Authentication & Security](#authentication--security)
9. [🤖 AI Integration](#ai-integration)
10. [🎨 Frontend Architecture](#frontend-architecture)
11. [🐛 Troubleshooting](#troubleshooting)
12. [⚡ Performance Optimization](#performance-optimization)
13. [🚢 Deployment Checklist](#deployment-checklist)
14. [💻 Development Workflow](#development-workflow)
15. [🎯 Career Recommendation Algorithm](#career-recommendation-algorithm)

## 🌟 Overview

Career Go is a Flask-based web application providing **AI-powered personalized career recommendations** based on user skills. This document covers technical implementation, setup, and configuration for developers.

### 🎯 Key Technologies
- 🐍 **Backend**: Flask 3.0.3, Python 3.8+
- 💾 **Database**: SQLite (local) / PostgreSQL (production)
- 🤖 **AI**: Groq API (Llama 3.3-70b-versatile)
- 🎨 **Frontend**: HTML5, CSS3, Vanilla JavaScript
- 📧 **Email**: Flask-Mail with Gmail SMTP

## 🛠️ Environment Setup

### ✅ Prerequisites
- 🐍 Python 3.8 or higher
- 📦 pip (Python package manager)
- 📧 Optional: Gmail account for password reset emails
- 💾 Optional: PostgreSQL for production deployment

### 📥 Installation

```bash
# 📂 Navigate to repository
cd Career_Go

# 🔧 Create virtual environment
python -m venv venv

# ⚡ Activate virtual environment
source venv/bin/activate     # 🐧 Linux/Mac
venv\Scripts\activate        # 🪟 Windows

# 📦 Install dependencies
pip install -r requirements.txt
```

### 📦 Dependency Management

```bash
# 📋 View installed packages
pip list

# ⬆️ Update a package
pip install --upgrade flask

# 💾 Export current environment
pip freeze > requirements.txt

# 🧹 Remove unused packages
pip uninstall package_name
```

## ⚙️ Configuration

### 🔐 Environment Variables (`.env`)

Copy `.env.example` to `.env` and set required values:

```env
# 🔑 Flask Secret Key (REQUIRED)
# Generate with: python -c "import secrets; print(secrets.token_hex(16))"
APP_SECRET=your_generated_secret_key_here

# 🧂 Password Salt (REQUIRED)
# Generate with: python -c "import secrets; print(secrets.token_hex(8))"
PW_SALT=your_generated_salt_here

# 🤖 Groq API Key (OPTIONAL - for AI features)
# Get from: https://console.groq.com/keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# 📧 Email Configuration (OPTIONAL - for password reset emails)
# Go to: https://myaccount.google.com/apppasswords
# Create app password and use here (remove spaces)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password_here

# 💾 Database URL (OPTIONAL - for PostgreSQL)
# Auto-set by cloud platforms (Railway, Render, Fly.io)
DATABASE_URL=postgresql://user:pass@host:port/database
```

**⚠️ Important**: Never commit `.env` to version control. Always use `.env.example` as a template.

### 🔒 Generating Secure Keys

```bash
# Generate APP_SECRET (32 characters)
python -c "import secrets; print(secrets.token_hex(16))"

# Generate PW_SALT (16 characters)
python -c "import secrets; print(secrets.token_hex(8))"

# Generate multiple keys at once
python -c "import secrets; print(f'APP_SECRET={secrets.token_hex(16)}\\nPW_SALT={secrets.token_hex(8)}')"
```

## 🚀 Running the Application

### 💻 Local Development
```bash
# 🎯 Development server with auto-reload
python app.py

# 🌐 Visit: http://localhost:5000
```

### 🏢 Production (Unix/Linux Only)
```bash
# 📦 Install production server
pip install gunicorn

# 🚀 Run with 4 worker processes
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# ⚙️ Or with more options
gunicorn -w 4 --threads 2 --timeout 120 --access-logfile - app:app
```

**⚠️ Note**: Gunicorn is Unix/Linux only. For Windows, use `waitress` or deploy to cloud.

### ☁️ Cloud Deployment
Deploy using Railway, Render, or Fly.io:
- 💾 Add a PostgreSQL database and set `DATABASE_URL`
- 🔐 Configure environment variables: `APP_SECRET`, `PW_SALT`, optional `GROQ_API_KEY`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- 🚀 Start command for production: `gunicorn app:app`

For detailed deployment instructions, see [README.md](README.md#deployment-options).

## 💾 Database

### 🗄️ Schema

**📋 Users Table**
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    pw_hash TEXT,
    gender TEXT,
    created_at TEXT
)
```

**🔄 Password Resets Table**
```sql
CREATE TABLE IF NOT EXISTS resets (
    email TEXT,
    code TEXT,
    created_at TEXT
)
```

### 🔧 Managing the Database

```bash
# 🗑️ Reset database (delete and recreate)
rm career.db
python app.py

# 🔍 Connect with sqlite3
sqlite3 career.db

# 📊 Common queries
sqlite> SELECT * FROM users;
sqlite> SELECT * FROM resets;
sqlite> DELETE FROM users WHERE id=1;
sqlite> .schema users
sqlite> .tables
sqlite> .exit
```

### 💾 Database Backup

```bash
# 📦 Backup SQLite database
cp career.db career.db.backup

# 🔄 Restore from backup
cp career.db.backup career.db

# 📤 Export to SQL file
sqlite3 career.db .dump > backup.sql

# 📥 Import from SQL file
sqlite3 career.db < backup.sql
```

## 🔌 API Endpoints

### 🔐 Authentication

#### 📝 POST /api/signup
Register a new user account.

```json
Request:
{
    "name": "John Doe",
    "email": "user@example.com",
    "password": "secure_password",
    "gender": "male"
}

Response (200):
{
    "message": "Signup successful"
}
```

#### 🔑 POST /api/login
Authenticate user and create session.

```json
Request:
{
    "email": "user@example.com",
    "password": "secure_password",
    "gender": "male"
}

Response (200):
{
    "message": "ok"
}
```

#### 📧 POST /api/forgot-email
Request password reset code.

```json
Request:
{
    "email": "user@example.com"
}

Response (200):
{
    "message": "Reset code sent to your email",
    "reset_code": "123456"
}
```

#### 🔄 POST /api/reset
Reset password with code.

```json
Request:
{
    "email": "user@example.com",
    "code": "123456",
    "new_password": "new_password"
}

Response (200):
{
    "message": "Password updated. Please login."
}
```

#### 🚪 POST /api/logout
Clear user session.

```json
Response (200):
{
    "message": "Logged out"
}
```

### 💼 Career Features

#### 🎯 POST /api/suggest_careers
Get career recommendations based on skills.

```json
Request:
{
    "skills": ["Python", "Data Analysis", "SQL"]
}

Response (200):
{
    "recommendations": [
        {
            "career": "Data Scientist",
            "score": 45,
            "top_skills": ["Data Analysis", "Python", "SQL"],
            "learn_link": "https://www.coursera.org"
        }
    ]
}
```

#### 💬 POST /api/chat
Chat with AI career advisor.

```json
Request:
{
    "message": "What skills do I need for machine learning?"
}

Response (200):
{
    "reply": "For machine learning, you'll need...",
    "source": "ai"
}
```

### 📄 Page Routes

- 🏠 `GET /` - Home page
- 📊 `GET /dashboard` - Career dashboard (requires login)
- 💬 `GET /chat` - Chat interface (requires login)
- 👤 `GET /profile` - User profile (requires login)
- ℹ️ `GET /about` - About page
- ❓ `GET /faq` - FAQ page
- 🔒 `GET /privacy` - Privacy policy
- ⚖️ `GET /terms` - Terms of service
- 📝 `GET /signup` - Registration page
- 🔑 `GET /login` - Login page
- 🔄 `GET /forgot` - Password reset page

## 📊 Data Files

### 📋 Skills & Careers Dataset
**File**: `data/skills_careers.csv`

```csv
career,skill_1,skill_2,skill_3,skill_4,skill_5,skill_6,skill_7,skill_8,score
Data Scientist,Python,SQL,Statistics,Machine Learning,Pandas,NumPy,Scikit-learn,Tableau,95
```

**Structure**:
- 💼 **career**: Job title
- 🛠️ **skill_1 to skill_8**: Required/relevant skills
- 📈 **score**: Not currently used in matching algorithm

### 📚 Learning Resources
**File**: `data/learning_links.json`

```json
[
    {
        "name": "Coursera",
        "url": "https://www.coursera.org"
    }
]
```

## 🔒 Authentication & Security

### 🔐 Password Hashing

Uses SHA256 with salt:

```python
import hashlib
import os

PW_SALT = os.environ.get('PW_SALT', 'salty')

def hash_pw(pw: str) -> str:
    return hashlib.sha256((PW_SALT + pw).encode()).hexdigest()

def verify_pw(pw: str, pw_hash: str) -> bool:
    import hmac
    return hmac.compare_digest(hash_pw(pw), pw_hash)
```

**🛡️ Security Notes**:
- 🔑 Salt stored in `.env`, not hardcoded
- ⏱️ HMAC used for timing-safe comparison
- 🚫 Passwords never stored in plain text

### 🍪 Session Management

```python
from flask import session

# Set session
session['user_id'] = 1
session['email'] = 'user@example.com'

# Check authentication
if 'user_id' not in session:
    redirect('/login')

# Clear session
session.clear()
```

### 📧 Email Configuration

Uses Flask-Mail with Gmail SMTP:

```python
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
```

## 🤖 AI Integration

### 🦙 Groq API (Llama Model)

```python
from groq import Groq

client = Groq(api_key=GROQ_API_KEY)
response = client.chat.completions.create(
    messages=[
        {"role": "system", "content": "You are a career advisor..."},
        {"role": "user", "content": "Tell me about data science"}
    ],
    model="llama-3.3-70b-versatile",
    temperature=0.7,
    max_tokens=512
)
```

### 🔄 Fallback System

If AI is unavailable (no API key ❌, rate limited ⏱️, network error 🌐), the system automatically falls back to CSV dataset matching with keyword-based skill analysis.

## 🎨 Frontend Architecture

### 📝 Template Inheritance

All templates extend `base.html`:

```html
{% extends "base.html" %}

{% block title %}Page Title - Career Go{% endblock %}

{% block content %}
<!-- Page content -->
{% endblock %}
```

### 🎨 Static Files

- 💅 `css/styles.css`: Main stylesheet (glassmorphism, themes, animations)
- 🌓 `js/theme.js`: Dark/light mode toggle
- ⚡ `js/main.js`: Form handlers, API calls, interactivity

### 🌈 Theme System

Supports light/dark themes with persistent storage:
- Theme stored in `localStorage`
- Toggle button with animated transition
- Glassmorphism effects adapt to theme

## 🐛 Troubleshooting

### 🔴 Port Already in Use

```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (Unix/Linux)
kill -9 <PID>
```

### 🔒 Database Locked

```bash
# Close all connections, then delete
rm career.db
python app.py
```

### 📧 Email Not Sending

- ✅ Verify MAIL_USERNAME and MAIL_PASSWORD in `.env`
- 🧹 Remove spaces from app password
- 📬 Check Gmail account has SMTP enabled
- 🐛 Enable Flask-Mail debug: `app.config['MAIL_DEBUG'] = True`

### 🤖 AI Not Responding

- 🔑 Check GROQ_API_KEY is valid
- 🌐 Verify Groq API status at https://console.groq.com
- 📡 Check internet connection
- 🔄 App automatically uses CSV fallback

### ❌ 404 Errors

- Verify template file exists in `templates/` directory
- Check route is defined in `app.py`
- Verify URL path matches route decorator

## ⚡ Performance Optimization

### 💾 Database Queries
```python
# Use indexed lookups
conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()

# Avoid N+1 queries
users = conn.execute('SELECT * FROM users').fetchall()
```

### 🗄️ Caching
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def load_data():
    # Load CSV/JSON once, cache in memory
    pass
```

### 🚀 Frontend Optimization
- 📦 CSS minification for production
- ⚡ JavaScript lazy-loading
- 🖼️ Image optimization
- 💾 Browser caching headers

## 🚢 Deployment Checklist

- [ ] 🔑 Set strong `APP_SECRET` and `PW_SALT`
- [ ] 🤖 Configure `GROQ_API_KEY` for AI features
- [ ] 📧 Setup `MAIL_USERNAME` and `MAIL_PASSWORD` for emails
- [ ] 🚀 Use production WSGI server (Gunicorn for Unix/Linux)
- [ ] 🔒 Enable HTTPS/SSL certificates
- [ ] 💾 Setup database backups (if using persistent database)
- [ ] 📝 Configure error logging
- [ ] ⚠️ Set `DEBUG=False` in production
- [ ] ⚙️ Use environment-specific configuration
- [ ] 📊 Monitor application health

## 💻 Development Workflow

### 🧪 Testing Changes

```bash
# Flask auto-reloads in debug mode
python app.py

# Test in browser
# Visit: http://localhost:5000

# Check syntax
python -m py_compile app.py
```

### 📦 Git Workflow

```bash
git add -A
git commit -m "✨ Feature: Add career suggestions API"
git push origin main
```

### 📝 Code Style

- 📏 PEP 8 for Python
- 📐 Consistent indentation (4 spaces)
- 🏷️ Descriptive variable names
- 💬 Comments for complex logic only

## 🎯 Career Recommendation Algorithm

### 🔍 How It Works

The system matches user skills against the CSV dataset:

1. 🔎 **Skill Matching**: For each user skill, find career entries with matching skills (case-insensitive, substring matching)
2. 📊 **Scoring**: Count number of skill matches per career
3. 📈 **Aggregation**: Aggregate scores across multiple entries for same career
4. 🏆 **Ranking**: Return top 12 careers by score

### ➕ Adding New Careers

1. Open `data/skills_careers.csv`
2. Add new rows with career name and 8 relevant skills
3. Restart the application to reload data

Example:
```csv
Blockchain Developer,Solidity,Ethereum,Smart Contracts,Cryptography,Web3,JavaScript,Security,Testing,85
```

## 💡 Support & Resources

- 🌐 **Flask Documentation**: https://flask.palletsprojects.com/
- 🤖 **Groq API Docs**: https://console.groq.com/docs
- 💾 **SQLite Guide**: https://www.sqlite.org/docs.html
- 🐍 **Python Docs**: https://docs.python.org/3/

---

📞 **Need Help?** Check [README.md](README.md) or review application logs for troubleshooting.
