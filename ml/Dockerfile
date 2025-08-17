# ml/Dockerfile
FROM python:3.10-slim

# set workdir
WORKDIR /app

# system deps (helpful for building some wheels, spacy, nltk)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# copy the requirements (api/requirements.txt)
COPY api/requirements.txt /app/requirements.txt

# install python deps
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy entire ml folder contents into image
COPY . /app

# run your NLP setup (downloads spacy + nltk assets)
# it executes ml/scripts/setup.py (path becomes /app/scripts/setup.py)
RUN python scripts/setup.py

# expose HF Spaces default port
EXPOSE 7860

# run uvicorn pointing to your FastAPI entrypoint inside api/main.py
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7860"]