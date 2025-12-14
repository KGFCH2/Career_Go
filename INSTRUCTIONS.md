# Career Go - Technical Instructions

## Overview

Career Go is a Flask-based web application that provides personalized career recommendations based on user skills. This document explains the technical implementation, particularly the scoring system and recommendation algorithm.

## Environment Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation
1. Clone or download the repository
2. Install dependencies: `pip install -r requirements.txt`

### Configuration
1. Copy `.env.example` to `.env`
2. Generate secure values for the following environment variables:

#### APP_SECRET (Flask Secret Key)
Used for session management and security. Generate a random secret key:
```bash
python -c "import secrets; print(secrets.token_hex(16))"
```
Example output: `fe4579532a4b41ad595cbc1d0cd23b95`

#### PW_SALT (Password Salt)
Used for password hashing. Generate a random salt:
```bash
python -c "import secrets; print(secrets.token_hex(8))"
```
Example output: `0ac95f445a1bc137`

**Important**: Never commit your `.env` file to version control. Keep these values secret and unique for your application.

### Running the Application
```bash
python app.py
```
The application will run on `http://localhost:5000`

## Dataset Structure

### Skills and Careers CSV (`data/skills_careers.csv`)

The core dataset uses the following CSV structure:

```csv
career,skill_1,skill_2,skill_3,skill_4,skill_5,skill_6,skill_7,skill_8,score
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

## Scoring System Explained

### What is the "Score" Field?

The **Score** field (50-99) represents the **relevance/importance** of a specific skill combination for a career. Higher scores indicate more essential or common skill combinations for that career.

### Score Interpretation:
- **90-99**: Core/essential skill combinations
- **80-89**: Very relevant combinations
- **70-79**: Moderately relevant combinations
- **60-69**: Somewhat relevant combinations
- **50-59**: Specialized/niche combinations

## Recommendation Algorithm

### How Career Recommendations Work

The system uses a **two-phase scoring algorithm**:

#### Phase 1: Skill Matching
For each user-inputted skill, the system:
1. Converts all skills to lowercase for case-insensitive matching
2. Finds career entries where user skills intersect with entry skills
3. Counts the number of matching skills (overlap)

#### Phase 2: Score Calculation
```
Final Score = (Number of Skill Matches) × (Base Score from CSV)
```

#### Phase 3: Aggregation
- Multiple entries for the same career are **summed together**
- Careers are ranked by total final score (highest first)
- Top 10 careers are returned to the user

### Algorithm Pseudocode

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

## Scoring Examples

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

### Example 3: Multiple Entries Aggregation
**Career**: Backend Developer
- **Entry 1**: 3 skill matches × score 78 = 234
- **Entry 2**: 2 skill matches × score 82 = 164
- **Entry 3**: 1 skill match × score 85 = 85
- **Total Final Score**: 234 + 164 + 85 = **483**

## Adding New Careers

### Step 1: Choose a Career
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

### Step 2: Define Skill Combinations
Create 2-4 entries per career with different skill combinations:

```csv
AI Ethics Consultant,Ethics,AI/ML,Policy,Regulation,Bias Detection,Fairness,Governance,Communication,85
AI Ethics Consultant,Machine Learning,Ethics,Python,Policy Analysis,Bias Mitigation,Data Privacy,Legal Compliance,Stakeholder Management,88
AI Ethics Consultant,AI Governance,Ethics Frameworks,Risk Assessment,Regulatory Compliance,Bias Auditing,Transparency,Accountability,Communication,82
```

### Step 3: Assign Appropriate Scores
- **High scores (85-95)**: Core skills for the career
- **Medium scores (70-84)**: Important but not essential skills
- **Lower scores (50-69)**: Specialized or emerging skill combinations

### Step 4: Add Learning Resources
Update `data/learning_links.json` with relevant learning platforms:

```json
{
  "provider": "Qiskit",
  "url": "https://qiskit.org/learn",
  "specialties": ["Quantum Computing", "Quantum Algorithms", "Qubit Programming"]
}
```

## Technical Implementation Details

### File Structure
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

### Key Functions

#### `load_data()`
- Loads CSV data into `DATA_ITEMS` list
- Loads learning links into `LEARN_LINKS` list
- Called once at application startup

#### `api_suggest()`
- POST endpoint: `/api/suggest`
- Accepts JSON: `{"skills": ["python", "javascript"]}`
- Returns top 10 career recommendations with scores

#### `dataset_answer()`
- Fallback function when Gemini API is unavailable
- Uses keyword matching on career names and skills
- Returns basic text recommendations

### API Endpoints

- **GET** `/` - Home page
- **POST** `/api/suggest` - Get career recommendations
- **POST** `/api/chat` - AI chat functionality
- **POST** `/api/signup` - User registration
- **POST** `/api/login` - User authentication

## Testing the Scoring System

### Manual Testing
```python
# Test career recommendations
from app import load_data, DATA_ITEMS
load_data()

# Simulate recommendation for specific skills
user_skills = ["python", "machine learning", "data analysis"]
# [Run the algorithm manually as shown in examples above]
```

### Automated Testing
```bash
# Run the Flask app
python app.py

# Test via API
curl -X POST http://localhost:5000/api/suggest \
  -H "Content-Type: application/json" \
  -d '{"skills": ["python", "javascript"]}'
```

## Modifying the Algorithm

### Changing Score Weights
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

### Adding New Scoring Factors
Consider adding:
- **Experience level weighting**
- **Skill rarity scoring**
- **Industry demand factors**
- **Geographic relevance**

## Data Quality Guidelines

### Skill Naming Conventions
- Use consistent capitalization (e.g., "Machine Learning" not "machine learning")
- Prefer specific technologies over general terms
- Include both technical and soft skills
- Use industry-standard terminology

### Career Naming
- Use standard job titles
- Include seniority levels when relevant (e.g., "Senior Data Scientist")
- Keep names concise but descriptive
- Consider emerging roles for future-proofing

### Score Assignment Best Practices
- **Research salary data** and job posting frequency
- **Consider skill combinations** that actually appear in job descriptions
- **Balance the dataset** so no career dominates recommendations
- **Regularly review and update** scores based on industry trends

## Troubleshooting

### Common Issues

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

### Debugging Commands

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

## Future Enhancements

### Potential Improvements
1. **Machine Learning-based scoring** using embeddings
2. **User feedback integration** to improve recommendations
3. **Dynamic score adjustment** based on job market data
4. **Personalized recommendations** using user profiles
5. **A/B testing framework** for scoring algorithm variants

### Dataset Expansion Ideas
- Add more granular skill levels (beginner, intermediate, expert)
- Include salary data and growth projections
- Add geographic location factors
- Incorporate certification requirements
- Include remote work friendliness scores

---

This documentation covers the core technical aspects of Career Go's recommendation system. For questions about specific implementations or modifications, refer to the source code in `app.py`.