import os
from google import genai
from dotenv import load_dotenv

# Load .env from root directory
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

if not api_key:
    print("No API key found.")
    exit(1)

client = genai.Client(api_key=api_key)

print(f"Checking models for key: {api_key[:10]}...")

try:
    for model in client.models.list():
        # Just print the name and a few likely attributes
        print(f"Model: {model.name}")
except Exception as e:
    print(f"Error listing models: {e}")
