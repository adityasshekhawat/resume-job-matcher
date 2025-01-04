from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)
    db.init_app(app)
    
    from app.controllers import auth, resume, jobs
    app.register_blueprint(auth.bp)
    app.register_blueprint(resume.bp)
    app.register_blueprint(jobs.bp)
    
    return app
