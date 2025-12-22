# 🚀 Career Go - AI-Powered Career Advisor

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-black.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/KGFCH2/Career_Go)

> 🎯 **Discover Your Perfect Career Path with AI-Powered Intelligence**

A cutting-edge **AI-Powered Personalized Career & Skills Advisor** web application that helps individuals discover their ideal career paths through intelligent analysis of their skills, interests, and goals. Built with Flask, powered by Groq AI (Llama 3.3-70b), and featuring a beautiful glassmorphism UI with dark/light themes.

## ✨ Key Features

- 🔐 **Secure Authentication System**
  - User registration and login with SHA256+salt encryption
  - Session-based authentication with secure cookie handling
  - Password reset with verification codes
  - Optional email integration for password recovery

- 🤖 **AI-Powered Career Advisor**
  - Groq API integration with Llama 3.3-70b-versatile model
  - Intelligent fallback to CSV dataset (700+ career entries)
  - Real-time conversational AI chat interface
  - Context-aware career recommendations

- 🎯 **Smart Skill Matching Engine**
  - Advanced algorithm matching user skills to career paths
  - 700+ career entries across 73 unique career paths
  - Multi-skill career suggestions with match scoring
  - Industry-aligned competency mapping

- 📊 **Interactive Career Dashboard**
  - Visual skill-to-career recommendations
  - Flip card animations for career details
  - Dynamic filtering and search capabilities
  - Required skills breakdown for each career

- 🌓 **Modern UI/UX Design**
  - Stunning glassmorphism design system
  - Smooth dark/light theme toggle
  - Responsive mobile-first layout
  - Font Awesome icons with hover animations
  - Pop-up effects and color transitions

- 💬 **Real-Time AI Chat**
  - Interactive career counseling
  - Personalized guidance and advice
  - Quick suggestion buttons
  - Message history with timestamps

- 📚 **Curated Learning Resources**
  - Links to 20+ top learning platforms
  - Coursera, edX, LinkedIn Learning, Udemy
  - Platform-specific courses and certifications
  - Free and paid options included

- 👥 **Personalized User Profiles**
  - Gender-based emoji avatars
  - Customizable user preferences
  - Profile statistics and insights
  - Account management features

- 📱 **Progressive Web App**
  - Fast loading with optimized assets
  - Smooth animations and transitions
  - Cross-browser compatibility
  - Mobile-optimized touch interactions

- 🔒 **Enterprise-Ready Security**
  - Environment variable configuration
  - HTTPS/TLS ready for production
  - CSRF protection via Flask sessions
  - Secure database operations

## 🚀 Quick Start

### 1. Setup Environment 🛠️
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables 🔐
```bash
# Copy template
cp .env.example .env

# Generate secure values
python -c "import secrets; print(secrets.token_hex(16))"  # For APP_SECRET
python -c "import secrets; print(secrets.token_hex(8))"   # For PW_SALT
```

Edit `.env` with:
- `APP_SECRET`: Your generated secret key 🔑
- `PW_SALT`: Your generated salt 🧂
- `GROQ_API_KEY`: Optional, get from https://console.groq.com 🤖
- `MAIL_USERNAME`: your_mail@email.com 📧
- `MAIL_PASSWORD`: Optional, for Gmail password reset 📬

### 3. Run the Application 🎯
```bash
python app.py
# Visit: http://localhost:5000 🌐
```
## 📁 Project Structure

```
Career_Go/
├── 📄 app.py                      # Main Flask application with routes & API
├── 📋 requirements.txt            # Python dependencies (Flask, Groq, etc.)
├── 🔐 .env                        # Environment variables (not in git)
├── 📝 .env.example                # Environment template for setup
├── 📖 README.md                   # Project documentation (this file)
├── 📚 INSTRUCTIONS.md             # Detailed technical documentation
├── ⚖️ LICENSE                     # MIT License
├── 💾 career.db                   # SQLite database (auto-generated)
│
├── 📊 data/                       # Dataset files
│   ├── skills_careers.csv         # 700+ career & skills mappings
│   └── learning_links.json        # Curated learning platform links
│
├── 🎨 templates/                  # Jinja2 HTML templates
│   ├── base.html                  # Base template with navigation
│   ├── index.html                 # Landing page with hero section
│   ├── signup.html                # User registration form
│   ├── login.html                 # User login form
│   ├── forgot.html                # Password reset request
│   ├── profile.html               # User profile page
│   ├── dashboard.html             # Career recommendations dashboard
│   ├── chat.html                  # AI chat interface
│   ├── about.html                 # About Career Go
│   ├── faq.html                   # Frequently asked questions
│   ├── privacy.html               # Privacy policy
│   ├── terms.html                 # Terms of service
│   ├── 404.html                   # Not found error page
│   └── 500.html                   # Server error page
│
└── 🎨 static/                     # Static assets
    ├── css/
    │   └── styles.css             # Glassmorphism styles & themes
    └── js/
        ├── main.js                # Form handlers & interactions
        └── theme.js               # Dark/light mode toggle
```

## 🏗️ Technical Architecture

### 🔧 Core Technologies

- **🐍 Backend Framework**: Flask 3.0.3
  - RESTful API design
  - Session-based authentication
  - Jinja2 templating engine
  - WSGI application server

- **💾 Database Layer**: Dual database support
  - SQLite (local development)
  - PostgreSQL (production via DATABASE_URL)
  - Automatic table initialization
  - Secure query execution

- **🔐 Security Implementation**
  - SHA256+salt password hashing
  - Session-based user authentication
  - Environment variable management
  - CSRF protection via Flask sessions
  - Secure cookie handling

- **🤖 AI Integration**
  - Groq API with Llama 3.3-70b-versatile model
  - Intelligent fallback to CSV dataset
  - Context-aware responses
  - Conversation history management

- **🎨 Frontend Stack**
  - HTML5 semantic markup
  - CSS3 with glassmorphism effects
  - Vanilla JavaScript (ES6+)
  - Font Awesome 6.5.1 icons
  - Responsive design principles

- **📊 Data Processing**
  - CSV parsing for career data
  - JSON handling for learning resources
  - Advanced skill matching algorithms
  - Real-time filtering and search

### 🗄️ Database Schema

**Users Table**
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `email` (TEXT UNIQUE)
- `gender` (TEXT)
- `password_hash` (TEXT)
- `created_at` (TIMESTAMP)

**Resets Table**
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT)
- `code` (TEXT)
- `created_at` (TIMESTAMP)

## 🔌 API Endpoints 🚀

### 🔐 Authentication
- `POST /api/signup` - 📝 Register new account
- `POST /api/login` - 🔑 Login to account
- `POST /api/forgot-email` - 💬 Request password reset code
- `POST /api/reset` - 🔐 Reset password with code
- `POST /api/logout` - 🚪 Logout and clear session

### 💼 Features
- `POST /api/suggest_careers` - 🎯 Get career suggestions based on skills
- `POST /api/chat` - 💬 Send message to AI or dataset
- `GET /profile` - 👤 View user profile

### 📄 Pages
- `GET /` - 🏠 Home
- `GET /dashboard` - 📊 Career dashboard
- `GET /chat` - 💬 Chat interface
- `GET /about` - ℹ️ About page
- `GET /faq` - 📞 FAQ
- `GET /privacy` - 🔒 Privacy policy
- `GET /terms` - ⚖️ Terms of service

## 🛠️ Technology Stack

### Backend 🐍
- **Flask 3.0.3** - Modern Python web framework
- **Python 3.8+** - Programming language
- **SQLite / PostgreSQL** - Database management
- **Groq API** - AI language model integration
- **psycopg2-binary** - PostgreSQL adapter
- **python-dotenv** - Environment variable management
- **Flask-Mail** - Email functionality

### Frontend 🎨
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with glassmorphism
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome 6.5.1** - Icon library
- **Google Fonts** - Inter typeface

### Design 🎭
- **Glassmorphism UI** - Modern glass-effect design
- **Dark/Light Themes** - User preference support
- **Responsive Layout** - Mobile-first approach
- **CSS Animations** - Smooth transitions and effects
- **Custom Color Schemes** - Carefully selected palette

### Development Tools 🔧
- **Git** - Version control
- **GitHub** - Repository hosting
- **VS Code** - Recommended IDE
- **Gunicorn** - Production WSGI server
- **Virtual Environment** - Python dependency isolation

## 🔒 Security Features

- 🔐 **Password Security**
  - SHA256 hashing with custom salt
  - Secure password storage
  - No plaintext password storage

- 🍪 **Session Management**
  - Secure session cookies
  - Server-side session storage
  - Automatic session expiration

- ✉️ **Email Validation**
  - Format validation
  - Duplicate prevention
  - Reset code generation

- 🔑 **Environment Security**
  - Sensitive data in .env file
  - .env excluded from version control
  - Environment variable validation

- 🛡️ **Application Security**
  - HTTPS/TLS ready
  - CSRF protection via Flask sessions
  - SQL injection prevention
  - XSS protection through Jinja2 escaping

- 🚫 **Access Control**
  - Route-level authentication checks
  - Session-based authorization
  - Protected API endpoints

## 📊 Dataset Overview

### 🎯 Career Database
- **73 Unique Career Paths** covering modern job market
- **700+ Skill Combinations** with detailed mappings
- **Industry Categories**:
  - 💼 **Traditional Tech**: Data Scientist, Full-Stack Developer, DevOps Engineer
  - 🚀 **Emerging Fields**: AI Ethics Consultant, Climate Tech Engineer, Web3 Developer
  - 🔬 **Specialized Domains**: Quantum Engineer, Biotech Researcher, EdTech Specialist
  - 🎨 **Creative Tech**: UX/UI Designer, Game Developer, AR/VR Developer
  - 📊 **Data & Analytics**: Business Intelligence Analyst, ML Engineer, Data Engineer
  - 🏥 **Health Tech**: HealthTech Developer, Medical Software Engineer
  - 💰 **FinTech**: Blockchain Developer, Financial Systems Analyst
  - 🌍 **Impact Tech**: Sustainability Engineer, Social Impact Analyst

### 📚 Learning Resources
**20+ Curated Platforms** including:
- 🎓 **MOOCs**: Coursera, edX, LinkedIn Learning, Udemy, Udacity
- ☁️ **Cloud Training**: Google Cloud Skills, AWS Training, Microsoft Learn, IBM Skills
- 💻 **Coding Platforms**: FreeCodeCamp, Codecademy, DataCamp, Kaggle, Khan Academy
- 🎨 **Design & Creative**: Behance, Dribbble, Adobe Learn
- 🔬 **Specialized**: Pluralsight, Skillshare, Treehouse

## 🚀 Deployment Options

### 💻 Local Development
```bash
# Start development server
python app.py

# Access application
# 🌐 http://localhost:5000
```

### ☁️ Cloud Deployment

#### 🚂 Railway (Recommended)
1. Connect your GitHub repository
2. Add PostgreSQL database service
3. Set environment variables:
   - `APP_SECRET`, `PW_SALT`
   - `DATABASE_URL` (auto-set by Railway)
   - `GROQ_API_KEY` (optional)
   - `MAIL_USERNAME`, `MAIL_PASSWORD` (optional)
4. Deploy automatically from main branch

#### 🎨 Render
1. Create new Web Service from GitHub
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `gunicorn app:app`
4. Add PostgreSQL database
5. Set environment variables (same as Railway)

#### ✈️ Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly launch`
3. Add PostgreSQL: `fly postgres create`
4. Attach database: `fly postgres attach`
5. Set environment variables: `fly secrets set`

#### 📦 Required Environment Variables
```env
# Required
APP_SECRET=your_32_char_secret_key
PW_SALT=your_16_char_salt

# Optional but recommended
GROQ_API_KEY=gsk_xxxxx                    # For AI features
DATABASE_URL=postgresql://...              # Auto-set on cloud platforms

# Optional for email
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_app_password
```

### 🏢 Production Server (Unix/Linux)
```bash
# Install production server
pip install gunicorn

# Run with 4 worker processes
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Or with more options
gunicorn -w 4 --threads 2 --timeout 120 app:app
```

**⚠️ Note**: Gunicorn is Unix/Linux only. For Windows production, consider using waitress or deploy to cloud.

## 🐛 Troubleshooting

### Common Issues

**🔴 Port Already in Use**
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**🗄️ Database Errors**
```bash
# Delete database and restart (loses data)
rm career.db
python app.py

# Or backup first
cp career.db career.db.backup
rm career.db
python app.py
```

**📧 Email Not Sending**
- Verify Gmail App Password (not regular password)
- Enable 2-factor authentication on Gmail
- Go to: https://myaccount.google.com/apppasswords
- Create app password for "Mail"
- Use generated password in `.env` (remove spaces)

**🤖 AI Chat Not Working**
- Check `GROQ_API_KEY` in `.env`
- Verify API key at: https://console.groq.com/keys
- App will automatically fallback to CSV dataset if AI fails
- Check console logs for specific error messages

**🔐 Session Issues**
- Clear browser cookies
- Verify `APP_SECRET` is set in `.env`
- Restart Flask application
- Check browser console for errors

**💾 PostgreSQL Connection Errors**
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Check psycopg2-binary is installed
- Ensure PostgreSQL service is running
- Review database logs

**🎨 CSS/JS Not Loading**
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- Check static file paths in templates
- Verify Flask static folder configuration
- Check browser console for 404 errors

## 📄 License

📜 **MIT License** - See [LICENSE](LICENSE) file for full details.

Copyright (c) 2025 Career Go

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 **Fork the repository**
2. 🌿 **Create your feature branch**: `git checkout -b feature/AmazingFeature`
3. 💾 **Commit your changes**: `git commit -m '✨ Add some AmazingFeature'`
4. 📤 **Push to the branch**: `git push origin feature/AmazingFeature`
5. 🔀 **Open a Pull Request**

### 📝 Contribution Guidelines
- Write clear, descriptive commit messages with emojis
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

## 🙏 Acknowledgments

- 📊 **Career Data**: Compiled from industry research and job market analysis
- 📚 **Learning Resources**: Curated from top educational platforms worldwide
- 🤖 **AI Technology**: Powered by Groq (Llama 3.3-70b-versatile model)
- 🎨 **Design Inspiration**: Modern glassmorphism and neumorphism trends
- 🛠️ **Built With**: Flask, Python, and passionate dedication to career development
- 💡 **Community**: Thanks to all contributors and users providing feedback

## 📞 Contact & Support

- 📧 **Email**: babinbid05@gmail.com
- 🐛 **Issues**: Report bugs on GitHub Issues
- 💬 **Discussions**: Join GitHub Discussions for questions
- ⭐ **Star this repo** if you find it helpful!

## 🎯 Future Roadmap

- [ ] 🌍 Multi-language support (i18n)
- [ ] 📱 Mobile app (React Native / Flutter)
- [ ] 🔗 LinkedIn profile integration
- [ ] 📈 Career progression tracking
- [ ] 🎓 Course recommendation engine
- [ ] 👥 Community forum and networking
- [ ] 📊 Advanced analytics dashboard
- [ ] 🎤 Voice-based career counseling
- [ ] 🤝 Mentor matching system
- [ ] 💼 Job board integration

---

<div align="center">

### 🚀 **Start Your Career Journey Today!** 🌟

**Made with ❤️ by <strong>Babin Bid</strong> who care about your career success**

[![GitHub stars](https://img.shields.io/github/stars/KGFCH2/Career_Go?style=social)](https://github.com/KGFCH2/Career_Go)
[![GitHub forks](https://img.shields.io/github/forks/KGFCH2/Career_Go?style=social)](https://github.com/KGFCH2/Career_Go)

**Last Updated: 22nd December, 2025** | **Contact: babinbid05@gmail.com**

</div>