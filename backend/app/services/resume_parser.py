import PyPDF2
from docx import Document
import re
import spacy
from typing import Dict, List, Any

class ResumeParser:
    def __init__(self):
        # Load spaCy model for NER
        self.nlp = spacy.load("en_core_web_sm")
        
    def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """Parse resume and extract relevant information"""
        text = self._extract_text(file_path)
        return {
            'skills': self._extract_skills(text),
            'experience': self._extract_experience(text),
            'education': self._extract_education(text)
        }
    
    def _extract_text(self, file_path: str) -> str:
        """Extract text from PDF or DOCX file"""
        if file_path.endswith('.pdf'):
            return self._extract_from_pdf(file_path)
        elif file_path.endswith('.docx'):
            return self._extract_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format")
    
    def _extract_from_pdf(self, file_path: str) -> str:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
        return text
    
    def _extract_from_docx(self, file_path: str) -> str:
        doc = Document(file_path)
        return " ".join([paragraph.text for paragraph in doc.paragraphs])
    
    def _extract_skills(self, text: str) -> List[str]:
        # Add your skill extraction logic here
        # This is a simple example - you might want to use a more sophisticated approach
        common_skills = ['python', 'java', 'javascript', 'react', 'node.js', 'sql', 
                        'machine learning', 'data analysis', 'project management']
        skills = []
        for skill in common_skills:
            if re.search(rf'\b{skill}\b', text.lower()):
                skills.append(skill)
        return skills
    
    def _extract_experience(self, text: str) -> List[Dict[str, str]]:
        # Add your experience extraction logic here
        # This is a placeholder - implement more sophisticated parsing
        experience = []
        # Use spaCy for named entity recognition
        doc = self.nlp(text)
        # Extract organizations and dates
        for ent in doc.ents:
            if ent.label_ == "ORG":
                experience.append({
                    "company": ent.text,
                    "position": "Unknown",  # You'll need more sophisticated parsing for this
                    "period": "Unknown"
                })
        return experience
    
    def _extract_education(self, text: str) -> List[Dict[str, str]]:
        # Add your education extraction logic here
        education = []
        education_keywords = ['bachelor', 'master', 'phd', 'degree']
        for line in text.split('\n'):
            for keyword in education_keywords:
                if keyword in line.lower():
                    education.append({
                        "degree": line.strip(),
                        "institution": "Unknown",  # You'll need more sophisticated parsing
                        "year": "Unknown"
                    })
        return education
