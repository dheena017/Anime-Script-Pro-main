# Dockerfile for FastAPI + SQLModel + Uvicorn
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app

EXPOSE 8001

CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
