import pytest
from app import create_app, db
from app.models.user import User
from config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

@pytest.fixture
def app():
    app = create_app(TestConfig)
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def auth_headers():
    """Create authentication headers for testing"""
    user = User(email='test@example.com')
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    
    token = user.generate_token()
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    return headers

@pytest.fixture
def test_user():
    """Create a test user"""
    user = User(email='test@example.com')
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    return user
