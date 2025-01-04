import json
import pytest
from app.models.user import User

def test_register(client):
    """Test user registration"""
    response = client.post('/auth/register', json={
        'email': 'newuser@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'token' in data
    assert 'user' in data
    assert data['user']['email'] == 'newuser@example.com'

def test_register_duplicate_email(client, test_user):
    """Test registration with existing email"""
    response = client.post('/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert 'Email already registered' in data['error']

def test_login_success(client, test_user):
    """Test successful login"""
    response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'token' in data
    assert 'user' in data
    assert data['user']['email'] == 'test@example.com'

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    response = client.post('/auth/login', json={
        'email': 'wrong@example.com',
        'password': 'wrongpassword'
    })
    
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data
    assert 'Invalid email or password' in data['error']

def test_get_current_user(client, auth_headers):
    """Test getting current user information"""
    response = client.get('/auth/me', headers=auth_headers)
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['email'] == 'test@example.com'

def test_protected_route_without_token(client):
    """Test accessing protected route without token"""
    response = client.get('/auth/me')
    
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data
    assert 'Token is missing' in data['error']
