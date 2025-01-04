import requests
from typing import List, Dict, Any
import os

class JobSearch:
    def __init__(self):
        self.api_key = os.getenv('JOB_SEARCH_API_KEY')
        self.base_url = "https://api.jobs.com/v1"  # Replace with actual job search API
    
    def search_jobs(self, skills: List[str], location: str = None, 
                   job_type: str = None) -> List[Dict[str, Any]]:
        """
        Search for jobs based on skills and other criteria
        """
        try:
            params = {
                'skills': ','.join(skills),
                'location': location,
                'job_type': job_type,
                'api_key': self.api_key
            }
            
            response = requests.get(f"{self.base_url}/search", params=params)
            response.raise_for_status()
            
            return self._process_jobs(response.json())
        except requests.RequestException as e:
            print(f"Error searching jobs: {str(e)}")
            return []
    
    def _process_jobs(self, jobs_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process and format job listings
        """
        processed_jobs = []
        for job in jobs_data:
            processed_jobs.append({
                'id': job.get('id'),
                'title': job.get('title'),
                'company': job.get('company'),
                'location': job.get('location'),
                'description': job.get('description'),
                'requirements': job.get('requirements', []),
                'salary_range': job.get('salary_range'),
                'url': job.get('url')
            })
        return processed_jobs
    
    def calculate_job_match_score(self, job: Dict[str, Any], 
                                resume_skills: List[str]) -> float:
        """
        Calculate match score between job and resume
        """
        if not job.get('requirements'):
            return 0.0
        
        job_skills = set(skill.lower() for skill in job['requirements'])
        user_skills = set(skill.lower() for skill in resume_skills)
        
        if not job_skills:
            return 0.0
            
        matching_skills = job_skills.intersection(user_skills)
        return len(matching_skills) / len(job_skills)
