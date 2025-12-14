# Career Go

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-black.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A polished **Personalized Career & Skills Advisor** you can run locally in VS Code. Pure **HTML/CSS/JS frontend + Python (Flask) backend**.

## Features
- 🔐 **Secure Authentication**: User registration, login, and password reset with proper validation
- 💬 **AI-Powered Chat**: Intelligent career counseling using Google Gemini API or local dataset
- 🗺️ **Skill-to-Career Mapping**: Advanced algorithm matching skills to career paths (700+ entries across 73 careers)
- 🌓 **Modern UI**: Dark/Light mode toggle with glassmorphism design
- ✨ **Interactive Elements**: Flip cards, smooth animations, and responsive design
- 🔗 **Learning Resources**: Curated links to 20+ learning platforms including Coursera, edX, Google Cloud Skills, and specialized platforms
- 🌐 **Progressive Web App**: Fast, accessible, and mobile-friendly
- 📊 **Data-Driven Insights**: Career recommendations based on comprehensive skill analysis
- 📄 **Comprehensive Pages**: About, Privacy Policy, Terms of Service, and Contact pages

## Demo
🚀 **Live Demo**: [View Screenshots](#) | [Try Locally](#quick-start)

*Professional glassmorphism UI with smooth animations and comprehensive career guidance.*

## Quick start
1. **Create a venv** (recommended) and install deps
   ```bash
   cd career-sage-pro
   python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. **Run**
   ```bash
   python app.py
   ```
   Visit http://localhost:5000

> The app creates a local SQLite DB `career.db` automatically on first run.

## Optional: plug in an AI model
Set an environment variable before starting:
```bash
export GEMINI_API_KEY=YOUR_KEY   # Windows PowerShell: $env:GEMINI_API_KEY="YOUR_KEY"
```
Then open **Chat** and ask questions. Without a key, the chat uses the dataset for grounded guidance.

## Career Database
The application includes a comprehensive database of **73 unique careers** with **700+ skill combinations** covering:

### Traditional Tech Careers
- Data Scientist, ML Engineer, DevOps Engineer, Full-Stack Developer
- Cybersecurity Analyst, Cloud Engineer, Mobile Developer, QA Engineer

### Emerging 2025 Careers
- **AI Ethics Consultant**: AI governance, bias detection, regulatory compliance
- **Climate Tech Engineer**: Renewable energy, carbon modeling, sustainability analytics
- **Metaverse Developer**: VR/AR, WebXR, 3D modeling, blockchain integration
- **Quantum Computing Engineer**: Qisk, quantum algorithms, qubit manipulation
- **Web3 Developer**: Smart contracts, DeFi, NFT development, blockchain
- **Autonomous Vehicle Engineer**: Computer vision, ROS, sensor fusion, path planning
- **FinTech Developer**: Payment systems, trading algorithms, regulatory compliance
- **HealthTech Engineer**: Medical imaging, telemedicine, healthcare data analytics
- **EdTech Developer**: Learning analytics, gamification, adaptive learning platforms
- **Sustainability Consultant**: ESG reporting, carbon footprint analysis, environmental policy
- **Biotech Engineer**: Genetic engineering, bioinformatics, synthetic biology
- **AgriTech Specialist**: Precision agriculture, IoT farming, crop monitoring
- **LegalTech Specialist**: Contract analysis, eDiscovery, regulatory automation
- **PropTech Analyst**: Real estate analytics, property valuation, market intelligence
- **InsurTech Developer**: Insurance innovation, risk modeling, claims automation
- **RegTech Specialist**: Compliance monitoring, regulatory reporting, risk analytics
- **Digital Twin Engineer**: Simulation, IoT integration, predictive analytics
- **Edge Computing Specialist**: Distributed systems, real-time processing, IoT architecture
- **Green Energy Analyst**: Renewable energy modeling, sustainability metrics, policy analysis
- **Space Systems Engineer**: Spacecraft design, orbital mechanics, satellite technology

## Architecture
```
career-sage-pro/
├── app.py                 # Flask backend with REST API
├── requirements.txt       # Python dependencies
├── LICENSE                # MIT License
├── data/
│   ├── skills_careers.csv # Career mapping dataset
│   └── learning_links.json # Educational resources
├── templates/             # Jinja2 HTML templates
├── static/                # Frontend assets
│   ├── css/styles.css     # Modern CSS with CSS variables
│   ├── js/
│   │   ├── main.js        # Frontend logic & API calls
│   │   └── theme.js       # Theme management
│   └── assets/            # Icons, images, favicon
└── README.md
```

## API Endpoints
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication
- `POST /api/forgot` - Password reset initiation
- `POST /api/reset` - Password reset completion
- `POST /api/suggest_careers` - Career recommendations
- `POST /api/chat` - AI chat functionality

## Technology Stack
- **Backend**: Python 3.8+, Flask 2.0+
- **Database**: SQLite (local development)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with glassmorphism effects
- **Icons**: SVG icons with CSS animations
- **Fonts**: Inter font family from Google Fonts

## Contributing
We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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