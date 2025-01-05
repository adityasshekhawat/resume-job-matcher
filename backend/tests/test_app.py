import pytest
from app import create_app, db
from app.models.user import User
from tests.config import TestConfig

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

def test_home_page(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"Resume Job Matcher API" in response.data

def test_register_user(client):
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "test123",
        "name": "Test User"
    })
    assert response.status_code in [201, 200]
    assert "token" in response.json
