import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///sahasra.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Service area configuration
    SERVICE_CENTER_LAT = 12.9716  # Bangalore coordinates as example
    SERVICE_CENTER_LNG = 77.5946
    SERVICE_RADIUS_KM = 50
    
    # File upload configuration
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
