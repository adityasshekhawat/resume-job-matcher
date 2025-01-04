import json
import pytest
import os
from io import BytesIO
from app.models.resume import Resume

def test_upload_resume(client, auth_headers):
    """Test resume upload"""
    data = {
        'file': (BytesIO(b'dummy resume content'), 'resume.pdf')
    }
    response = client.post('/upload', 
                          data=data,
                          headers={
                              'Authorization': auth_headers['Authorization']
                          })
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'resume_id' in data
    assert 'parsed_data' in data
    assert 'skills' in data['parsed_data']
    assert 'experience' in data['parsed_data']
    assert 'education' in data['parsed_data']

def test_upload_invalid_file_type(client, auth_headers):
    """Test uploading invalid file type"""
    data = {
        'file': (BytesIO(b'dummy content'), 'resume.txt')
    }
    response = client.post('/upload',
                          data=data,
                          headers={
                              'Authorization': auth_headers['Authorization']
                          })
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert 'Invalid file type' in data['error']

def test_search_jobs_without_resume(client, auth_headers):
    """Test job search without uploaded resume"""
    response = client.post('/search-jobs',
                          json={
                              'resume_id': 999,
                              'location': 'New York',
                              'job_type': 'Full-time'
                          },
                          headers=auth_headers)
    
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data
    assert 'Resume not found' in data['error']

def test_search_jobs_success(client, auth_headers, test_user):
    """Test successful job search"""
    # First upload a resume
    data = {
        'file': (BytesIO(b'dummy resume content'), 'resume.pdf')
    }
    upload_response = client.post('/upload',
                                data=data,
                                headers={
                                    'Authorization': auth_headers['Authorization']
                                })
    resume_id = json.loads(upload_response.data)['resume_id']
    
    # Then search for jobs
    response = client.post('/search-jobs',
                          json={
                              'resume_id': resume_id,
                              'location': 'New York',
                              'job_type': 'Full-time'
                          },
                          headers=auth_headers)
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'jobs' in data
    assert isinstance(data['jobs'], list)
    if data['jobs']:
        job = data['jobs'][0]
        assert 'title' in job
        assert 'company' in job
        assert 'location' in job
        assert 'match_score' in job
