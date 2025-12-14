# Career Go - Technical Documentation 📚

## Overview 🎯

Career Go is a Flask-based web application providing **AI-powered personalized career recommendations** based on user skills. This document covers technical implementation, setup, and configuration.

## Environment Setup ⚙️

### Prerequisites 📋
- Python 3.8 or higher
- pip (Python package manager)
- Optional: Gmail account for password reset emails 📧

### Installation 📦

```bash
# Clone or navigate to repository
cd Career_Go

# Create virtual environment 🐍
python -m venv venv

# Activate virtual environment ✅
source venv/bin/activate     # Linux/Mac
venv\Scripts\activate        # Windows

# Install dependencies ⬇️
pip install -r requirements.txt
```

### Dependency Management 🔧

```bash
# 📦 View installed packages
pip list

# ⬆️ Update a package
pip install --upgrade flask

# 💾 Export current environment
pip freeze > requirements.txt
```

## Configuration ⚙️

### Environment Variables (`.env`) 🔐

Copy `.env.example` to `.env` and set required values:

```env
# 🔑 Flask Secret Key (REQUIRED)
# Generate: python -c "import secrets; print(secrets.token_hex(16))"
APP_SECRET=fe4579532a4b41ad595cbc1d0cd23b95

# 🧂 Password Salt (REQUIRED)
# Generate: python -c "import secrets; print(secrets.token_hex(8))"
PW_SALT=0ac95f445a1bc137

# 🤖 Groq API Key (OPTIONAL - for AI features)
# Get from: https://console.groq.com/keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# 📧 Email Configuration (OPTIONAL - for password reset emails)
# 1️⃣ Go to https://myaccount.google.com/apppasswords
# 2️⃣ Select Mail and Windows (or your device)
# 3️⃣ Copy 16-character app password (remove spaces)
MAIL_USERNAME=babinbid05@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Remove spaces: xxxxxxxxxxxxxxxx
```

**⚠️ Important**: Never commit `.env` to version control.

## Running the Application 🚀

### Development Mode 🛠️

```bash
# 🐛 With debug mode (auto-reload, detailed errors)
python app.py

# 🌐 Visit: http://localhost:5000
```

### Production Mode 🏭

```bash
# 🐍 Using Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Database 💾

### Schema 🗂️

**👥 Users Table**
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

### Managing the Database 🛠️

```bash
# 🔄 Reset database (delete and recreate)
rm career.db
python app.py

# 💻 Connect to database with sqlite3
sqlite3 career.db

# 🔍 Common queries
sqlite> SELECT * FROM users;
sqlite> SELECT * FROM resets;
sqlite> DELETE FROM users WHERE id=1;
```

## API Endpoints 🔌

### Authentication 🔐

#### Signup 📝
```
POST /api/signup
Content-Type: application/json

{
    "name": "John Doe",
    "email": "babinbid05@gmail.com",
    "password": "secure_password",
    "gender": "male"  # Options: male, female, nonbinary, other, unspecified
}

Response: 200 OK
{
    "message": "Account created",
    "user_id": 1
}
```

#### Login 🔑
```
POST /api/login
Content-Type: application/json

{
    "email": "babinbid05@gmail.com",
    "password": "secure_password",
    "gender": "male"  # Optional
}

Response: 200 OK
{
    "message": "Login successful",
    "user_id": 1
}
```

#### Forgot Password ❓
```
POST /api/forgot-email
Content-Type: application/json

{
    "email": "babinbid05@gmail.com"
}

Response: 200 OK
{
    "message": "Reset code generated",
    "reset_code": "123456"  # If email not configured
}
```

#### Reset Password 🔄
```
POST /api/reset
Content-Type: application/json

{
    "email": "babinbid05@gmail.com",
    "code": "123456",
    "new_password": "new_secure_password"
}

Response: 200 OK
{
    "message": "Password updated"
}
```

### Career Features 🎯

#### Get Career Suggestions 💼
```
POST /api/suggest_careers
Content-Type: application/json

{
    "skills": ["Python", "Data Analysis", "SQL"]
}

Response: 200 OK
{
    "recommendations": [
        {
            "career": "Data Scientist",
            "score": 45,
            "top_skills": ["Data Analysis", "Python", "SQL"],
            "learn_link": "https://www.coursera.org"
        },
        ...
    ]
}
```

#### Chat with AI 🤖
```
POST /api/chat
Content-Type: application/json

{
    "message": "What skills do I need for machine learning?"
}

Response: 200 OK
{
    "reply": "For machine learning, you'll need...",
    "source": "ai"  # or "dataset"
}
```

### Session Management 🔐

#### Logout 🚪
```
POST /api/logout

Response: 200 OK
{
    "message": "ok"
}
```

## Data Files 📁

### Skills & Careers Dataset (`data/skills_careers.csv`) 📊

Structure:
```csv
career,skill_1,skill_2,skill_3,skill_4,skill_5,skill_6,skill_7,skill_8,score
Data Scientist,Python,SQL,Statistics,Machine Learning,Data Visualization,Pandas,NumPy,Scikit-learn,95
...
```

**Format**:
- `career`: Job title
- `skill_1` through `skill_8`: Required/relevant skills
- `score`: Relevance score (1-100)

### Learning Resources (`data/learning_links.json`) 📚

Structure:
```json
[
    {
        "name": "Coursera",
        "url": "https://www.coursera.org"
    },
    {
        "name": "edX",
        "url": "https://www.edx.org"
    },
    ...
]
```

## Authentication & Security 🔐

### Password Hashing 🔒

Uses **SHA256 with salt**:

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

**Security Notes**:
- Salt is stored in `.env`, not hardcoded
- HMAC is used for timing-safe comparison
- Passwords never stored in plain text

### Session Usage 💻

```python
from flask import session

# Set session
session['user_id'] = 1
session['email'] = 'user@example.com'

# Check if user is authenticated
if 'user_id' not in session:
    redirect('/login')

# Clear session
session.clear()
```

### Email Configuration 📧

Uses Flask-Mail with Gmail SMTP:

```python
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
```

## AI Integration 🤖

### Groq API (Llama Model) 🧠

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

### Fallback System 🔄

If AI is unavailable:
1. Groq API not configured (no GROQ_API_KEY)
2. API rate limited or down
3. Network error

Falls back to CSV dataset matching:

```python
def dataset_answer(prompt: str) -> str:
    # Keyword-based skill matching against CSV data
    # Returns top 5 matching careers
```

## Frontend Architecture 🎨

### Template Inheritance 📄 📄

All templates extend `base.html`:

```html
{% extends "base.html" %}

{% block title %}Page Title - Career Go{% endblock %}

{% block content %}
<!-- Page content -->
{% endblock %}
```

### Static Files 📁

- `css/styles.css`: Main stylesheet (glassmorphism, themes, animations)
- `js/theme.js`: Dark/light mode toggle
- `js/main.js`: Form handlers, API calls, interactivity

### Form Validation ✅

Client-side (JavaScript):
```javascript
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
```

Server-side (Python):
```python
import email_validator
email_validator.validate_email(email)
```

## Troubleshooting 🔧

### Common Issues ⚠️

**Port Already in Use**
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

**Database Locked**
```bash
# Close all connections, then delete
rm career.db
python app.py
```

**Email Not Sending**
- Verify MAIL_USERNAME and MAIL_PASSWORD in `.env`
- Remove spaces from app password
- Check Gmail account has SMTP enabled
- Use Flask-Mail debug: `app.config['MAIL_DEBUG'] = True`

**AI Not Responding**
- Check GROQ_API_KEY is valid
- Verify Groq API status at https://console.groq.com
- Check internet connection
- App will use CSV fallback automatically

**404 Errors**
- Verify template file exists in `templates/` directory
- Check route is defined in `app.py`
- Verify URL path matches route decorator

## Performance Optimization ⚡

### Database Queries 💾
```python
# Indexed lookups
conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()

# Avoid N+1 queries
users = conn.execute('SELECT * FROM users').fetchall()
```

### Caching 🧠
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def load_data():
    # Load CSV/JSON once, cache in memory
    pass
```

### Frontend Optimization 🎨
- CSS minification
- JavaScript lazy-loading
- Image optimization
- Browser caching headers

## Deployment Checklist ✅

- [ ] Set strong `APP_SECRET` and `PW_SALT`
- [ ] Configure `GROQ_API_KEY` for AI features
- [ ] Setup `MAIL_USERNAME` and `MAIL_PASSWORD` for emails
- [ ] Use production WSGI server (Gunicorn, uWSGI)
- [ ] Enable HTTPS/SSL certificates
- [ ] Setup database backups
- [ ] Configure error logging
- [ ] Set `DEBUG=False`
- [ ] Use environment-specific configuration
- [ ] Monitor application health

## Development Workflow 🔄

### Testing Changes 🧪

```bash
# 1. Make code changes
# 2. Flask auto-reloads (debug mode)
# 3. Test in browser at http://localhost:5000

# Or manual testing:
python -m py_compile app.py  # Check syntax
pytest tests/              # Run tests (if available)
```

### Git Workflow 📚

```bash
git add -A
git commit -m "Feature: Add career suggestions API"
git push origin main
```

### Code Style 🎨

- PEP 8 for Python
- Consistent indentation (4 spaces)
- Descriptive variable names
- Comments for complex logic

## Support & Resources 📖

- **Flask Documentation**: https://flask.palletsprojects.com/
- **Groq API Docs**: https://console.groq.com/docs
- **SQLite Guide**: https://www.sqlite.org/docs.html
- **Python Docs**: https://docs.python.org/3/

---

**For issues or questions, check README.md or review application logs.**
Data Analyst,Tableau,Terraform,Presentation,Agile,Scala,Communication,Scikit‑learn,Cryptography,67
```

#### Column Descriptions:
- **`career`**: The career/job title (e.g., "Data Analyst", "AI Ethics Consultant")
- **`skill_1` to `skill_8`**: Specific skills associated with this career entry
- **`score`**: Base relevance score (50-99) for this skill combination

### Current Dataset Statistics:
- **Total entries**: 696
- **Unique careers**: 73
- **Score range**: 50-99
- **Average score**: ~75

## Scoring System Explained 📊

### What is the "Score" Field? 📊

The **Score** field (50-99) represents the **relevance/importance** of a specific skill combination for a career. Higher scores indicate more essential or common skill combinations for that career.

### Score Interpretation 📈
- **90-99**: Core/essential skill combinations
- **80-89**: Very relevant combinations
- **70-79**: Moderately relevant combinations
- **60-69**: Somewhat relevant combinations
- **50-59**: Specialized/niche combinations

## Recommendation Algorithm 🧠

### How Career Recommendations Work ⚙️

The system uses a **two-phase scoring algorithm**:

#### Phase 1: Skill Matching 🔍
For each user-inputted skill, the system:
1. Converts all skills to lowercase for case-insensitive matching
2. Finds career entries where user skills intersect with entry skills
3. Counts the number of matching skills (overlap)

#### Phase 2: Score Calculation 🧮
```
Final Score = (Number of Skill Matches) × (Base Score from CSV)
```

#### Phase 3: Aggregation 📊
- Multiple entries for the same career are **summed together**
- Careers are ranked by total final score (highest first)
- Top 10 careers are returned to the user

### Algorithm Pseudocode 💻

```python
def get_career_recommendations(user_skills):
    scores = {}  # career -> {score: int, skills: set}

    for each career_entry in dataset:
        career_name = career_entry["career"]
        entry_skills = [career_entry[f"skill_{i}"].lower() for i in range(1,9)]
        overlap = count_matching_skills(user_skills, entry_skills)

        if overlap > 0:
            if career_name not in scores:
                scores[career_name] = {"score": 0, "skills": set()}

            # Add weighted score: overlap × base_score
            scores[career_name]["score"] += overlap * int(career_entry["score"])
            scores[career_name]["skills"].update(entry_skills)

    # Sort by final score and return top 10
    return sorted(scores.items(), key=lambda x: x[1]["score"], reverse=True)[:10]
```

## Scoring Examples 📈

### Example 1: Single Skill Match
**User Skills**: `["python"]`
**Career Entry**: `["Data Analyst", "SQL", "Python", "Excel", "Statistics", "Tableau", "R", "Communication", 85]`

- **Overlap**: 1 (Python matches)
- **Final Score**: 1 × 85 = **85**

### Example 2: Multiple Skill Matches
**User Skills**: `["python", "machine learning"]`
**Career Entry**: `["AI Researcher", "Python", "Machine Learning", "Deep Learning", "TensorFlow", "Statistics", "Research", "Communication", 92]`

- **Overlap**: 2 (Python + Machine Learning)
- **Final Score**: 2 × 92 = **184**

### Example 3: Multiple Entries Aggregation ➕
**Career**: Backend Developer
- **Entry 1**: 3 skill matches × score 78 = 234
- **Entry 2**: 2 skill matches × score 82 = 164
- **Entry 3**: 1 skill match × score 85 = 85
- **Total Final Score**: 234 + 164 + 85 = **483**

## Adding New Careers ➕

### Step 1: Choose a Career 🎯
Select a career that's not already in the dataset. Check existing careers:

```bash
python -c "
import csv
careers = set()
with open('data/skills_careers.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        careers.add(row['career'])
print('Existing careers:', sorted(list(careers)))
"
```

### Step 2: Define Skill Combinations 🛠️
Create 2-4 entries per career with different skill combinations:

```csv
AI Ethics Consultant,Ethics,AI/ML,Policy,Regulation,Bias Detection,Fairness,Governance,Communication,85
AI Ethics Consultant,Machine Learning,Ethics,Python,Policy Analysis,Bias Mitigation,Data Privacy,Legal Compliance,Stakeholder Management,88
AI Ethics Consultant,AI Governance,Ethics Frameworks,Risk Assessment,Regulatory Compliance,Bias Auditing,Transparency,Accountability,Communication,82
```

### Step 3: Assign Appropriate Scores 📊
- **High scores (85-95)**: Core skills for the career
- **Medium scores (70-84)**: Important but not essential skills
- **Lower scores (50-69)**: Specialized or emerging skill combinations

### Step 4: Add Learning Resources 📚
Update `data/learning_links.json` with relevant learning platforms:

```json
{
  "provider": "Qiskit",
  "url": "https://qiskit.org/learn",
  "specialties": ["Quantum Computing", "Quantum Algorithms", "Qubit Programming"]
}
```

## Technical Implementation Details ⚙️

### File Structure 📁
```
career-sage-pro_consider/
├── app.py                    # Flask backend with recommendation logic
├── data/
│   ├── skills_careers.csv   # Career-skill dataset
│   └── learning_links.json  # Learning resource links
├── templates/               # Jinja2 HTML templates
├── static/                  # CSS, JS, assets
└── requirements.txt         # Python dependencies
```

### Key Functions 🔧

#### `load_data()` 📥
- Loads CSV data into `DATA_ITEMS` list
- Loads learning links into `LEARN_LINKS` list
- Called once at application startup

#### `api_suggest()` 🎯
- POST endpoint: `/api/suggest`
- Accepts JSON: `{"skills": ["python", "javascript"]}`
- Returns top 10 career recommendations with scores

#### `dataset_answer()` 🔄
- Fallback function when Gemini API is unavailable
- Uses keyword matching on career names and skills
- Returns basic text recommendations

### API Endpoints

- **GET** `/` - Home page
- **POST** `/api/suggest` - Get career recommendations
- **POST** `/api/chat` - AI chat functionality
- **POST** `/api/signup` - User registration
- **POST** `/api/login` - User authentication

## Testing the Scoring System 🧪

### Manual Testing
```python
# Test career recommendations
from app import load_data, DATA_ITEMS
load_data()

# Simulate recommendation for specific skills
user_skills = ["python", "machine learning", "data analysis"]
# [Run the algorithm manually as shown in examples above]
```

### Automated Testing 🧪
```bash
# Run the Flask app
python app.py

# Test via API
curl -X POST http://localhost:5000/api/suggest \
  -H "Content-Type: application/json" \
  -d '{"skills": ["python", "javascript"]}'
```

## Modifying the Algorithm ⚙️

### Changing Score Weights ⚖️
To modify how scores are calculated, edit the `api_suggest()` function in `app.py`:

```python
# Current: overlap * base_score
scores[career]["score"] += overlap * int(r["score"])

# Alternative: exponential weighting
scores[career]["score"] += (overlap ** 2) * int(r["score"])

# Alternative: skill importance weighting
skill_weights = {"python": 1.5, "machine learning": 2.0}
weighted_overlap = sum(skill_weights.get(skill, 1.0) for skill in matching_skills)
scores[career]["score"] += weighted_overlap * int(r["score"])
```

### Adding New Scoring Factors ➕
Consider adding:
- **Experience level weighting**
- **Skill rarity scoring**
- **Industry demand factors**
- **Geographic relevance**

## Data Quality Guidelines ✅

### Skill Naming Conventions 📝
- Use consistent capitalization (e.g., "Machine Learning" not "machine learning")
- Prefer specific technologies over general terms
- Include both technical and soft skills
- Use industry-standard terminology

### Career Naming 🏷️
- Use standard job titles
- Include seniority levels when relevant (e.g., "Senior Data Scientist")
- Keep names concise but descriptive
- Consider emerging roles for future-proofing

### Score Assignment Best Practices 📊
- **Research salary data** and job posting frequency
- **Consider skill combinations** that actually appear in job descriptions
- **Balance the dataset** so no career dominates recommendations
- **Regularly review and update** scores based on industry trends

## Troubleshooting 🔧

### Common Issues ⚠️

1. **Career not appearing in recommendations**
   - Check if skills exactly match (case-sensitive comparison)
   - Verify the career has entries in the CSV
   - Ensure scores are in valid range (50-99)

2. **Incorrect scoring**
   - Verify CSV parsing (check for encoding issues)
   - Confirm score field is being read as integer
   - Check for duplicate career entries

3. **Performance issues**
   - Dataset size: 696 entries should be fine
   - Consider indexing if dataset grows significantly
   - Profile the recommendation algorithm for bottlenecks

### Debugging Commands 🐛

```bash
# Check dataset loading
python -c "from app import load_data, DATA_ITEMS; load_data(); print(f'Loaded {len(DATA_ITEMS)} items')"

# Verify CSV structure
python -c "
import csv
with open('data/skills_careers.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    sample = next(reader)
    print('Columns:', list(sample.keys()))
    print('Sample row:', sample)
"

# Test specific career matching
python -c "
from app import load_data, DATA_ITEMS
load_data()
career = 'AI Ethics Consultant'
matches = [r for r in DATA_ITEMS if r['career'] == career]
print(f'{career} has {len(matches)} entries')
for i, match in enumerate(matches[:2]):
    print(f'Entry {i+1}: score {match[\"score\"]}, skills: {match[\"skill_1\"]}, {match[\"skill_2\"]}, ...')
"
```

## Future Enhancements 🚀

### Potential Improvements 💡
1. **Machine Learning-based scoring** using embeddings
2. **User feedback integration** to improve recommendations
3. **Dynamic score adjustment** based on job market data
4. **Personalized recommendations** using user profiles
5. **A/B testing framework** for scoring algorithm variants

### Dataset Expansion Ideas 📈
- Add more granular skill levels (beginner, intermediate, expert)
- Include salary data and growth projections
- Add geographic location factors
- Incorporate certification requirements
- Include remote work friendliness scores

---

This documentation covers the core technical aspects of Career Go's recommendation system. For questions about specific implementations or modifications, refer to the source code in `app.py`.