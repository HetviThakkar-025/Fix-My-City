import time
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
from ml.scripts.preprocessing import preprocess_text_column
from ml.scripts.feature_utils import count_high_words

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
