import time
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import pickle
import pandas as pd
import numpy as np
from typing import Optional
from ml.scripts.preprocessing import preprocess_text_column
from ml.scripts.feature_utils import count_high_words
from ml.scripts.predict_duplicates import detect_duplicates
from ml.scripts.predict_summary import generate_summary
from ml.scripts.predict_toxicity import toxicity_detector


app = FastAPI(
    title="FixMyCity ML Service",
    version="1.0",
    description="API to predict report priority"
)

print("Loading model & embedder...")
with open("ml/models/priority_model.pkl", 'rb') as f:
    model, embedder = pickle.load(f)
print("Loaded!")


class PredictRequest(BaseModel):
    descriptions: list[str]


class PredictResponse(BaseModel):
    predictions: list[str]


class DuplicateRequest(BaseModel):
    reports: List[Dict]  # each dict must have id, title, description, lat, lng


class DuplicateResponse(BaseModel):
    duplicates: List[Dict]  # each dict with report1, report2, similarity


class SummaryRequest(BaseModel):
    descriptions: list[str]


class SummaryResponse(BaseModel):
    summaries: list[str]


class ToxicityRequest(BaseModel):
    texts: List[str]
    threshold: Optional[float] = 0.9


class ToxicityResponse(BaseModel):
    results: List[Dict]


def build_features(texts):

    clean = preprocess_text_column(pd.Series(texts))

    embeddings = embedder.encode(clean)  # shape: (n_samples, 384)

    num_high = [count_high_words(text) for text in texts]

    # Combine into feature vectors
    features = np.hstack([embeddings, np.array(num_high).reshape(-1, 1)])
    print(f" Feature vector shape: {features.shape}")
    return features


@app.post("/predict-priority", response_model=PredictResponse)
def predict_priority_batch(req: PredictRequest):

    overall_start = time.time()

    # Step 1: build features
    start = time.time()
    features = build_features(req.descriptions)
    print(f"Step: Feature building took {time.time() - start:.2f} seconds")

    # Step 2: prediction
    start = time.time()
    preds = model.predict(features)
    print(f"Step: Model prediction took {time.time() - start:.2f} seconds")

    print(f" Total request time: {time.time() - overall_start:.2f} seconds")

    return PredictResponse(predictions=preds.tolist())


@app.post("/predict-duplicates", response_model=DuplicateResponse)
def predict_duplicates(req: DuplicateRequest):
    print(f"Received {len(req.reports)} reports for duplicate detection")
    dup = detect_duplicates(req.reports)
    return DuplicateResponse(duplicates=dup)


@app.post("/generate-summary", response_model=SummaryResponse)
def generate_summary_batch(req: SummaryRequest):
    print(f"Received {len(req.descriptions)} descriptions for summarization")
    summaries = generate_summary(req.descriptions)
    return SummaryResponse(summaries=summaries)


@app.post("/detect-toxicity", response_model=ToxicityResponse)
async def detect_toxicity(req: ToxicityRequest):
    """
    Detect toxic content in reports using AI model
    """
    print(f"Received {len(req.texts)} texts for toxicity detection")
    # print(req.texts)
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
