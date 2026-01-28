import os
import sys

# Add the project root to sys.path so we can import from backend_python
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import the FastAPI app
from backend_python.app.main import app

# Vercel needs a variable named 'app'
