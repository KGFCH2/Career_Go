# Career Go - AI-Powered Career Advisor
# Flask-based web app for personalized career recommendations

from flask import Flask, render_template, request, jsonify, redirect, session
import os, csv, json, random, sqlite3, hashlib, hmac
from datetime import datetime
from dotenv import load_dotenv
import sys

load_dotenv()

# Try to import Groq AI client (optional dependency)
try:
    from groq import Groq
except Exception:
    Groq = None

# Try to import Flask-Mail for email functionality (optional)
try:
    from flask_mail import Mail, Message
except Exception:
    Mail = None
    Message = None

# Try to import PostgreSQL adapter (optional, for production deployments)
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except Exception:
    psycopg2 = None
    RealDictCursor = None

# Load configuration from environment variables
APP_SECRET = os.environ.get('APP_SECRET', 'dev-secret')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
DATABASE_URL = os.environ.get('DATABASE_URL', '')  # PostgreSQL connection string

# Initialize Flask application
app = Flask(__name__)
app.secret_key = APP_SECRET

# Configure email settings if Flask-Mail is available
if Mail is not None:
    app.config.update(
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USERNAME=MAIL_USERNAME,
        MAIL_PASSWORD=MAIL_PASSWORD,
    )
    mail = Mail(app)
else:
    mail = None

# File paths for data storage
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'skills_careers.csv')
LINKS_PATH = os.path.join(BASE_DIR, 'data', 'learning_links.json')

# Determine database type based on environment
USE_POSTGRES = bool(DATABASE_URL) and psycopg2 is not None
DB_PATH = 'career.db'  # SQLite fallback for local development


# 🗄️ Database Functions

def get_db():
    """Get database connection (PostgreSQL when DATABASE_URL is set; otherwise SQLite)"""
    if USE_POSTGRES:
        # PostgreSQL connection for production (persistent storage)
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    else:
        # SQLite connection for local development
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn


def init_db():
    """Initialize database tables if they don't exist"""
    conn = get_db()
    cur = conn.cursor()
    
    if USE_POSTGRES:
        # PostgreSQL table creation
        cur.execute('''CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            pw_hash TEXT,
            gender TEXT,
            created_at TEXT
        )''')
        cur.execute('''CREATE TABLE IF NOT EXISTS resets (
            email TEXT, code TEXT, created_at TEXT
        )''')
    else:
        # SQLite table creation
        cur.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            pw_hash TEXT,
            gender TEXT,
            created_at TEXT
        )''')
        cur.execute('''CREATE TABLE IF NOT EXISTS resets (
            email TEXT, code TEXT, created_at TEXT
        )''')
    conn.commit()
    conn.close()


# 🔐 Password Security Functions

def hash_pw(pw: str) -> str:
    """Hash password with SHA256 and salt"""
    salt = os.environ.get('PW_SALT', 'salty')
    return hashlib.sha256((salt + pw).encode()).hexdigest()


def verify_pw(pw: str, pw_hash: str) -> bool:
    """Verify password against hash using HMAC"""
    return hmac.compare_digest(hash_pw(pw), pw_hash)


# 📊 Data Loading Functions

def load_data():
    """Load career skills and learning links data"""
    items = []
    links = []
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                items.append(row)
    if os.path.exists(LINKS_PATH):
        with open(LINKS_PATH, encoding='utf-8') as f:
            try:
                links = json.load(f)
            except Exception:
                links = []
    return items, links


try:
    DATA_ITEMS, LEARN_LINKS = load_data()  # Load data on startup
except Exception as e:
    import traceback, sys
    traceback.print_exc(file=sys.stderr)
    DATA_ITEMS, LEARN_LINKS = [], []

# Initialize database on module import (ensures tables exist at startup)
try:
    init_db()
except Exception as e:
    import traceback
    traceback.print_exc(file=sys.stderr)
    print(f"Database initialization warning: {e}", file=sys.stderr)



def top_link():
    """Get random learning resource link"""
    if LEARN_LINKS:
        return random.choice(LEARN_LINKS).get('url')
    return '#'


# 🤖 AI Functions

def model_chat_api(prompt: str) -> str:
    """Get AI response from Groq API (Llama model)"""
    if not GROQ_API_KEY or Groq is None:
        return ''  # No API key or Groq not installed
    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful career advisor. Keep answers concise."},
                {"role": "user", "content": prompt}
            ],
            model='llama-3.3-70b-versatile',  # AI model
            temperature=0.7,  # Creativity level
            max_tokens=512  # Response length limit
        )
        if response and response.choices and response.choices[0].message.content:
            return response.choices[0].message.content.strip()
    except Exception:
        pass  # Silent failure
    return ''  # No response


def dataset_answer(prompt: str) -> str:
    """Generate career suggestions from CSV dataset"""
    p = (prompt or '').lower()
    if not p:
        return "Please tell me some skills or ask a question about careers."  # Empty prompt

    # Check for bot identity questions
    if any(x in p for x in ['who are you', 'what can you do']):
        return "I'm Career Go — tell me your skills and I'll suggest careers."  # Bot introduction

    # Search for skill matches in dataset
    hits = {}
    for r in DATA_ITEMS[:3000]:  # Limit search for performance
        career = r.get('career', '')
        skills = [r.get(f'skill_{i}', '').lower() for i in range(1, 9)]
        for s in skills:
            if s and s in p:  # Skill match found
                hits.setdefault(career, 0)
                hits[career] += 1

    if not hits:
        return "I couldn't find matches — try listing skills like 'Python, SQL'."  # No matches

    # Get top 5 career matches
    best = sorted(hits.items(), key=lambda kv: kv[1], reverse=True)[:5]
    lines = ["Based on those skills, consider:"]
    for name, _ in best:
        lines.append(f"- {name} — resources: {top_link()}")  # Add learning link
    return "\n".join(lines)


# 🌐 Page Routes

@app.route('/')
def home():
    """Home page route"""
    return render_template('index.html')


@app.route('/signup')
def signup():
    """User registration page"""
    return render_template('signup.html')


@app.route('/login')
def login():
    """User login page"""
    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    """Career dashboard with skill recommendations"""
    suggestions = []
    seen = set()
    for r in DATA_ITEMS:
        c = r.get('career')
        if not c or c in seen:
            continue
        seen.add(c)
        skills = [r.get('skill_1'), r.get('skill_2'), r.get('skill_3')]
        suggestions.append({'career': c, 'skills': skills, 'learn_link': top_link()})
        if len(suggestions) >= 12:  # Limit to 12 suggestions
            break
    return render_template('dashboard.html', suggestions=suggestions)


@app.route('/chat')
def chat():
    """AI chat interface"""
    return render_template('chat.html')


@app.route('/about')
def about():
    """ℹ️ About page"""
    return render_template('about.html')


@app.route('/privacy')
def privacy():
    """Privacy policy page"""
    return render_template('privacy.html')


@app.route('/terms')
def terms():
    """Terms of service page"""
    return render_template('terms.html')


@app.route('/faq')
def faq():
    """FAQ page"""
    return render_template('faq.html')


@app.route('/forgot')
def forgot():
    """Password reset page"""
    return render_template('forgot.html')


# 🔌 API Endpoints

# 🔐 Authentication APIs

@app.post('/api/signup')
def api_signup():
    """User registration API endpoint"""
    data = request.get_json(force=True)
    name = data.get('name', '').strip()
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    gender = data.get('gender', 'unspecified').strip().lower()

    # Validate required fields
    if not (name and email and password):
        return jsonify({'message': 'All fields required.'}), 400

    pw_hash = hash_pw(password)  # Hash password
    conn = get_db()
    try:
        conn.execute('INSERT INTO users (name, email, pw_hash, gender, created_at) VALUES (?,?,?,?,?)',
                     (name, email, pw_hash, gender, datetime.utcnow().isoformat()))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'message': 'Email already exists'}), 400
    conn.close()
    return jsonify({'message': 'Signup successful'}), 200


@app.post('/api/login')
def api_login():
    """User authentication API endpoint"""
    data = request.get_json(force=True)
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    gender = data.get('gender', '').strip().lower()

    conn = get_db()
    row = conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
    conn.close()

    # Invalid credentials check
    if not row or not verify_pw(password, row['pw_hash']):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Login successful - set session
    session['user_id'] = row['id']
    session['email'] = row['email']

    # Update gender if provided
    if gender:
        conn = get_db()
        try:
            conn.execute('UPDATE users SET gender=? WHERE id=?', (gender, row['id']))
            conn.commit()
        finally:
            conn.close()

    return jsonify({'message': 'ok'}), 200


@app.post('/api/forgot-email')
def api_forgot():
    """Password reset code generation API"""
    data = request.get_json(force=True)
    email = data.get('email', '').lower().strip()

    # Validate email input
    if not email:
        return jsonify({'message': 'Email required'}), 400

    # Check if email exists in database
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
    if not user:
        conn.close()
        return jsonify({'message': 'Email not found in our system'}), 404

    # Generate 6-digit reset code
    code = ''.join(random.choice('0123456789') for _ in range(6))
    conn.execute('INSERT INTO resets (email, code, created_at) VALUES (?,?,?)',
                 (email, code, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

    # Attempt to send email
    email_sent = False
    error_msg = ''

    if mail is not None and MAIL_USERNAME and MAIL_PASSWORD:
        try:
            msg = Message(subject='Career Go - Reset Code', recipients=[email])
            msg.body = f'Your reset code: {code}\n\nThis code will expire soon. Please use it to reset your password.'
            mail.send(msg)
            email_sent = True  # Email sent successfully
        except Exception as e:
            error_msg = str(e)
            print(f"Email sending failed: {error_msg}", file=sys.stderr)  # Log error

    # Return appropriate response
    if email_sent:
        return jsonify({'message': 'Reset code sent to your email. Check your inbox or spam folder.', 'reset_code': code}), 200
    else:
        # Fallback: return code in response if email not configured
        return jsonify({
            'message': f'Reset code generated: {code}. Email delivery is not configured. Use this code to reset your password.',
            'reset_code': code
        }), 200


@app.post('/api/reset')
def api_reset():
    """Password reset API endpoint"""
    data = request.get_json(force=True)
    email = data.get('email', '').lower().strip()
    code = data.get('code', '').strip()
    new_pw = data.get('new_password', '')

    # Validate all required fields
    if not (email and code and new_pw):
        return jsonify({'message': 'Missing fields'}), 400

    conn = get_db()
    # Verify reset code
    row = conn.execute('SELECT * FROM resets WHERE email=? ORDER BY created_at DESC LIMIT 1', (email,)).fetchone()
    if not row or row['code'] != code:
        conn.close()
        return jsonify({'message': 'Invalid code'}), 400

    # Update password hash
    conn.execute('UPDATE users SET pw_hash=? WHERE email=?', (hash_pw(new_pw), email))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Password updated. Please login.'}), 200


@app.post('/api/chat')
def api_chat():
    """AI chat API - responds to career questions"""
    data = request.get_json(force=True)
    msg = data.get('message', '').strip()

    # Validate message input
    if not msg:
        return jsonify({'reply': 'Please enter a question.'}), 200

    # Try AI first, fallback to dataset
    if GROQ_API_KEY and Groq is not None:
        ai = model_chat_api(msg)
        if ai:
            return jsonify({'reply': ai, 'source': 'ai'}), 200

    # Use dataset fallback
    return jsonify({'reply': dataset_answer(msg), 'source': 'dataset'}), 200


@app.post('/api/suggest_careers')
def api_suggest_careers():
    """Career suggestion API based on user skills"""
    data = request.get_json(force=True)
    skills = data.get('skills', [])

    # Check for skills input
    if not skills:
        return jsonify({'recommendations': []}), 200

    # Convert skills to lowercase for matching
    skills_lower = [s.lower().strip() for s in skills]

    # Find matching careers with scoring
    career_scores = {}
    for r in DATA_ITEMS:
        career = r.get('career', '')
        if not career:
            continue

        # Get all skills for this career entry
        career_skills = [r.get(f'skill_{i}', '').lower() for i in range(1, 9)]

        # Calculate score based on matching skills
        score = 0
        matched_skills = []
        for user_skill in skills_lower:
            for career_skill in career_skills:
                if user_skill and career_skill and user_skill in career_skill:
                    score += 1  # Skill match found
                    if career_skill not in matched_skills:
                        matched_skills.append(career_skill)

        # Accumulate scores for careers
        if score > 0:
            if career not in career_scores:
                career_scores[career] = {'score': score, 'skills': []}
            career_scores[career]['score'] += score
            career_scores[career]['skills'].extend(matched_skills)

    # Sort by score and get top 12 recommendations
    sorted_careers = sorted(career_scores.items(), key=lambda x: x[1]['score'], reverse=True)[:12]

    recommendations = []
    for career, data in sorted_careers:
        unique_skills = list(set(data['skills']))[:3]  # Top 3 unique skills
        recommendations.append({
            'career': career,
            'score': data['score'],
            'top_skills': unique_skills,
            'learn_link': top_link()  # Learning resource
        })

    return jsonify({'recommendations': recommendations}), 200


@app.post('/api/logout')
def api_logout():
    """User logout API - clears session"""
    session.clear()
    return jsonify({'message': 'ok'}), 200


@app.route('/profile')
def profile():
    """User profile page"""
    if 'user_id' not in session:
        return redirect('/login')  # Require authentication

    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE id=?', (session['user_id'],)).fetchone()
    conn.close()

    if not user:
        return redirect('/login')  # User not found

    return render_template('profile.html', user=dict(user))


# 🚨 Error Handlers

@app.errorhandler(404)
def not_found(e):
    """404 Not Found error handler"""
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_error(e):
    """500 Internal Server Error handler"""
    return render_template('500.html'), 500


# 🚀 Application Startup

if __name__ == '__main__':
    # Database already initialized at module level
    app.run(host='0.0.0.0', port=5000, debug=True)  # Start development server
