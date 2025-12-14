# Career Go 🎓

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-black.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A powerful **AI-Powered Personalized Career & Skills Advisor** web application. Get intelligent career recommendations based on your skills using advanced matching algorithms and AI integration.

## ✨ Key Features

- 🔐 **Secure Authentication**: Registration, login, and password reset with SHA256 encryption
- 🤖 **AI Career Advisor**: Groq API integration (Llama model) with intelligent fallback system
- 🎯 **Smart Skill Matching**: Advanced algorithm matching user skills to 700+ career entries across 73 career paths
- 📊 **Interactive Dashboard**: Visual skill-to-career recommendations with filtering
- 🌓 **Dark/Light Theme**: Glassmorphism design with smooth theme transitions
- 💬 **Real-time Chat**: Ask career questions and get personalized guidance
- 📚 **Learning Resources**: Curated links to 20+ platforms (Coursera, edX, LinkedIn Learning, etc.)
- 👥 **User Profiles**: Gender-based emoji profiles and personalized experiences
- 📱 **Responsive Design**: Mobile-friendly with flip cards and smooth animations
- 🔄 **Password Reset**: Secure reset code generation with optional email delivery
- ⚡ **Progressive Web App**: Fast, smooth performance with optimized animations

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables
```bash
# Copy template
cp .env.example .env

# Generate secure values
python -c "import secrets; print(secrets.token_hex(16))"  # For APP_SECRET
python -c "import secrets; print(secrets.token_hex(8))"   # For PW_SALT
```

Edit `.env` with:
- `APP_SECRET`: Your generated secret key
- `PW_SALT`: Your generated salt
- `GROQ_API_KEY`: Optional, get from https://console.groq.com
- `MAIL_USERNAME` & `MAIL_PASSWORD`: Optional, for Gmail password reset
## 📁 Project Structure

```
Career_Go/
├── app.py                   # Main Flask application
├── requirements.txt         # Python dependencies
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── README.md               # This file
├── INSTRUCTIONS.md         # Technical documentation
├── LICENSE                 # MIT License
├── data/
│   ├── skills_careers.csv      # Career & skills dataset (700+ entries)
│   └── learning_links.json     # Curated learning resources
├── templates/              # Jinja2 HTML templates
│   ├── base.html, signup.html, login.html, forgot.html
│   ├── profile.html, dashboard.html, chat.html
│   ├── about.html, contact.html, privacy.html, terms.html
│   └── 404.html, 500.html
├── static/
│   ├── css/styles.css      # Glassmorphism styling & themes
│   └── js/
│       ├── main.js         # Form handlers & interactivity
│       └── theme.js        # Dark/light mode toggle
└── career.db              # SQLite database (auto-created)
```

## 🏗️ Architecture

- **Backend**: Flask 3.0.3 with REST API endpoints
- **Database**: SQLite with `users` and `resets` tables
- **Authentication**: Session-based with SHA256+salt password hashing
- **AI Integration**: Groq API (llama-3.3-70b-versatile) with CSV fallback
- **Frontend**: Vanilla JavaScript, responsive CSS with glassmorphism
- **Data**: 700+ career-skill mappings across 73 unique careers

## 🔌 API Endpoints

### Authentication
- `POST /api/signup` - Register new account
- `POST /api/login` - Login to account
- `POST /api/forgot-email` - Request password reset code
- `POST /api/reset` - Reset password with code
- `POST /api/logout` - Logout and clear session

### Features
- `POST /api/suggest_careers` - Get career suggestions based on skills
- `POST /api/chat` - Send message to AI or dataset
- `GET /profile` - View user profile

### Pages
- `GET /` - Home
- `GET /dashboard` - Career dashboard
- `GET /chat` - Chat interface
- `GET /about` - About page
- `GET /contact` - FAQ/Contact
- `GET /privacy` - Privacy policy
- `GET /terms` - Terms of service

## 🛠️ Technology Stack

- **Backend**: Python 3.8+, Flask 3.0.3
- **Database**: SQLite (local)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **UI**: Glassmorphism design with dark/light theme
- **Icons**: Emoji + SVG animations
- **Fonts**: Inter (Google Fonts)

## 🔒 Security Features

- SHA256+salt password hashing
- Session-based authentication
- Email validation & reset codes
- Environment variable management
- HTTPS/TLS ready
- CSRF protection via Flask sessions

## 📊 Dataset

**73 Unique Careers** with **700+ skill combinations** including:
- Traditional: Data Scientist, Full-Stack Developer, DevOps Engineer
- Emerging: AI Ethics Consultant, Climate Tech Engineer, Web3 Developer
- Specialized: Quantum Engineer, Biotech, EdTech, FinTech, HealthTech
- + 40+ more covering modern job market demands

## 📚 Learning Resources

20+ curated platforms including:
- Coursera, edX, LinkedIn Learning, Udemy
- Google Cloud Skills, AWS Training, Microsoft Learn
- FreeCodeCamp, Codecademy, DataCamp, Kaggle
- Specialized platforms for emerging fields

## 🚀 Deployment

### Development
```bash
python app.py  # Runs on http://localhost:5000
```

### Production
```bash
pip install gunicorn
gunicorn app:app
```

## 🐛 Troubleshooting

**Port in use**: Kill process on port 5000
**Database errors**: Delete `career.db` and restart
**Email not sending**: Verify MAIL_USERNAME and MAIL_PASSWORD in `.env`
**AI not working**: Check GROQ_API_KEY; app will use CSV fallback

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Career data from industry sources
- Learning resources from top platforms
- Built with Flask, Python, and modern web technologies

---

**Start Your Career Journey Today! 🚀**

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
- 📧 **Email**: support@careersagepro.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/career-sage-pro/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/career-sage-pro/wiki)

## Acknowledgments
- Career data sourced from various professional development resources
- UI inspiration from modern design systems
- Special thanks to the open-source community