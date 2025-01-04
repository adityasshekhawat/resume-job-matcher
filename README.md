# Resume Job Matcher

An intelligent job search application that analyzes resumes and matches them with relevant job listings using natural language processing and machine learning techniques.

## Features

- Resume parsing (PDF and DOCX support)
- Skill extraction and analysis
- Intelligent job matching
- Job search with location and type filters
- Match scoring system
- User authentication and profile management

## Tech Stack

### Backend
- Python 3.9+
- Flask (Web Framework)
- SQLAlchemy (ORM)
- Celery (Background Tasks)
- Redis (Cache & Message Broker)
- spaCy (NLP)
- PyPDF2 & python-docx (Document Parsing)

### Frontend (to be implemented)
- React
- Material-UI
- Redux Toolkit
- Axios

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Install spaCy model:
```bash
python -m spacy download en_core_web_sm
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

6. Start Redis server (required for Celery):
```bash
redis-server
```

7. Start Celery worker:
```bash
celery -A app.celery worker --loglevel=info
```

8. Run the development server:
```bash
flask run
```

## API Documentation

### Resume Endpoints

#### POST /upload
Upload and parse a resume file (PDF or DOCX)

Request:
- Content-Type: multipart/form-data
- Body: file (PDF or DOCX)

Response:
```json
{
    "message": "Resume uploaded successfully",
    "resume_id": 1,
    "parsed_data": {
        "skills": [...],
        "experience": [...],
        "education": [...]
    }
}
```

#### POST /search-jobs
Search for matching jobs based on resume

Request:
```json
{
    "resume_id": 1,
    "location": "San Francisco, CA",
    "job_type": "Full-time"
}
```

Response:
```json
{
    "jobs": [
        {
            "id": "job_id",
            "title": "Software Engineer",
            "company": "Tech Corp",
            "location": "San Francisco, CA",
            "match_score": 0.85,
            "description": "...",
            "requirements": [...],
            "salary_range": "..."
        }
    ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
