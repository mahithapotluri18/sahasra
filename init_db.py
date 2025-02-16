from app import db, app
from app import User, Service, Review
from werkzeug.security import generate_password_hash
from datetime import datetime

def init_db():
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if we already have data
        if User.query.first():
            return
        
        # Create sample users
        admin = User(
            name='Admin',
            email='admin@sahasra.com',
            password_hash=generate_password_hash('admin123'),
            location='Bangalore'
        )
        
        # Add sample users
        db.session.add(admin)
        db.session.commit()
        
        # Create sample services
        services = [
            {
                'name': 'Garden Maintenance',
                'category': 'gardening',
                'description': 'Professional garden maintenance services',
                'provider_id': admin.id,
                'location': 'Bangalore',
                'latitude': 12.9716,
                'longitude': 77.5946
            },
            {
                'name': 'Healing Therapy',
                'category': 'healers',
                'description': 'Natural healing therapy services',
                'provider_id': admin.id,
                'location': 'Bangalore',
                'latitude': 12.9716,
                'longitude': 77.5946
            }
        ]
        
        for service_data in services:
            service = Service(**service_data)
            db.session.add(service)
        
        db.session.commit()

if __name__ == '__main__':
    init_db()
