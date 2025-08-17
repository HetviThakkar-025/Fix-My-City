FROM python:3.10-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt /app/requirements.txt

# Install Python deps
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy everything in ml/ into /app
COPY . /app

# Run NLP setup
RUN python scripts/setup.py

EXPOSE 7860

# Run FastAPI app
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7860"]
