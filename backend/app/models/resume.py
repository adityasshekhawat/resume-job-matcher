from datetime import datetime
from app import db

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    parsed_data = db.Column(db.JSON)
    skills = db.Column(db.JSON)
    experience = db.Column(db.JSON)
    education = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'skills': self.skills,
            'experience': self.experience,
            'education': self.education,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
