from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
from ml.scripts.preprocessing import preprocess_text_column
from ml.scripts.feature_utils import count_high_words

app = FastAPI(title="FixMyCity ML Service", version="1.0",
              description="API to predict report priority")

# Load model & embedder once at startup
print("Loading model & embedder...")
with open("ml/models/priority_model.pkl", 'rb') as f:
    model, embedder = pickle.load(f)
print("Loaded!")

# Request and response models


class PredictRequest(BaseModel):
    descriptions: list[str]


class PredictResponse(BaseModel):
    predictions: list[str]

# Helper: build features for input texts


def build_features(texts):
    # Preprocess texts
    clean = preprocess_text_column(pd.Series(texts))  # list of cleaned strings

    # Embed
    embeddings = embedder.encode(clean)  # shape: (n_samples, 384)

    # Extra feature: num_high_words
    num_high = [count_high_words(text) for text in texts]  # list of ints

    # Combine
    # shape: (n_samples, 385)
    features = np.hstack([embeddings, np.array(num_high).reshape(-1, 1)])

    print(f"Feature vector shape: {features.shape}")
    return features


@app.post("/predict-priority", response_model=PredictResponse)
def predict_priority_batch(req: PredictRequest):
    features = build_features(req.descriptions)

    # Predict
    preds = model.predict(features)
    return PredictResponse(predictions=preds.tolist())
