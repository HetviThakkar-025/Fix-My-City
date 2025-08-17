# main.py
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from ml.scripts.predict_toxicity import toxicity_detector
from ml.scripts.predict_summary import generate_summary
from ml.scripts.predict_duplicates import detect_duplicates
from ml.scripts.feature_utils import count_high_words
from ml.scripts.preprocessing import preprocess_text_column, get_nlp
from pydantic import BaseModel
from fastapi import FastAPI
import pandas as pd
import numpy as np
from typing import List, Dict, Optional
import os
import time

app = FastAPI(
    title="FixMyCity ML Service",
    version="1.0",
    description="API to predict report priority"
)

MODEL_PATH = Path(__file__).parent.parent / "models" / "priority_model.pkl"

# Lazy-loaded globals
model, embedder = None, None

MAX_BATCH_SIZE = 20  # prevent large batch memory spikes


def get_model_and_embedder():
    global model, embedder
    if model is None or embedder is None:
        import pickle
        print(f"[INFO] Loading model & embedder from: {MODEL_PATH}")
        with open(MODEL_PATH, 'rb') as f:
            model, embedder = pickle.load(f)
        print("[INFO] Model & embedder loaded successfully")
    return model, embedder


def build_features(texts: List[str]):
    if len(texts) > MAX_BATCH_SIZE:
        raise ValueError(f"Batch too large. Max allowed: {MAX_BATCH_SIZE}")

    model_local, embedder_local = get_model_and_embedder()

    # Preprocessing
    clean = preprocess_text_column(pd.Series(texts))

    # Embeddings
    embeddings = embedder_local.encode(clean)

    # Additional features
    num_high = [count_high_words(text) for text in texts]

    # Combine
    features = np.hstack([embeddings, np.array(num_high).reshape(-1, 1)])
    return features

# -------------------- Pydantic Models --------------------


class PredictRequest(BaseModel):
    descriptions: List[str]


class PredictResponse(BaseModel):
    predictions: List[str]


class DuplicateRequest(BaseModel):
    reports: List[Dict]  # each dict must have id, title, description, lat, lng


class DuplicateResponse(BaseModel):
    duplicates: List[Dict]  # each dict with report1, report2, similarity


class SummaryRequest(BaseModel):
    descriptions: List[str]


class SummaryResponse(BaseModel):
    summaries: List[str]


class ToxicityRequest(BaseModel):
    texts: List[str]
    threshold: Optional[float] = 0.9


class ToxicityResponse(BaseModel):
    results: List[Dict]

# -------------------- API Endpoints --------------------


@app.post("/predict-priority", response_model=PredictResponse)
def predict_priority_batch(req: PredictRequest):
    overall_start = time.time()
    features = build_features(req.descriptions)
    start = time.time()
    model_local, _ = get_model_and_embedder()
    preds = model_local.predict(features)
    print(
        f"[INFO] Feature building + prediction took {time.time() - overall_start:.2f}s")
    return PredictResponse(predictions=preds.tolist())


@app.post("/predict-duplicates", response_model=DuplicateResponse)
def predict_duplicates(req: DuplicateRequest):
    print(
        f"[INFO] Received {len(req.reports)} reports for duplicate detection")
    dup = detect_duplicates(req.reports)
    return DuplicateResponse(duplicates=dup)


@app.post("/generate-summary", response_model=SummaryResponse)
def generate_summary_batch(req: SummaryRequest):
    print(
        f"[INFO] Received {len(req.descriptions)} descriptions for summarization")
    summaries = generate_summary(req.descriptions)
    return SummaryResponse(summaries=summaries)


@app.post("/detect-toxicity", response_model=ToxicityResponse)
async def detect_toxicity(req: ToxicityRequest):
    print(f"[INFO] Received {len(req.texts)} texts for toxicity detection")
    results = toxicity_detector.predict_toxicity(req.texts)

    # Apply threshold
    for result in results:
        if 'scores' in result:
            result['is_toxic'] = any(
                score > req.threshold for label, score in result['scores'].items()
                if label != 'neutral'
            )
    return ToxicityResponse(results=results)


@app.get("/")
def home():
    return {"status": "OK"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=7860, reload=False)
