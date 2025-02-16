from app import app
from waitress import serve

if __name__ == "__main__":
    print("Starting production server on http://localhost:5000")
    serve(app, host='0.0.0.0', port=5000)
