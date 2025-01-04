from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from app import db
from app.models.resume import Resume
from app.services.resume_parser import ResumeParser
from app.services.job_search import JobSearch

bp = Blueprint('resume', __name__)
parser = ResumeParser()
job_search = JobSearch()

ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Parse resume
        parsed_data = parser.parse_resume(file_path)
        
        # Save to database
        resume = Resume(
            user_id=g.user.id,  # Assuming user authentication is implemented
            filename=filename,
            parsed_data=parsed_data,
            skills=parsed_data['skills'],
            experience=parsed_data['experience'],
            education=parsed_data['education']
        )
        
        db.session.add(resume)
        db.session.commit()
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return jsonify({
            'message': 'Resume uploaded successfully',
            'resume_id': resume.id,
            'parsed_data': parsed_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/search-jobs', methods=['POST'])
def search_jobs():
    data = request.get_json()
    resume_id = data.get('resume_id')
    location = data.get('location')
    job_type = data.get('job_type')
    
    if not resume_id:
        return jsonify({'error': 'Resume ID is required'}), 400
    
    try:
        resume = Resume.query.get(resume_id)
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
            
        # Search for jobs based on resume skills
        jobs = job_search.search_jobs(
            skills=resume.skills,
            location=location,
            job_type=job_type
        )
        
        # Calculate match scores for each job
        for job in jobs:
            job['match_score'] = job_search.calculate_job_match_score(
                job, resume.skills
            )
        
        # Sort jobs by match score
        jobs.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({
            'jobs': jobs
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
