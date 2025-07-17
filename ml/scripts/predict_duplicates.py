import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import cdist
import pickle

# Load embedder (from your priority_model.pkl, or separate embedder.pkl)
with open("ml/models/priority_model.pkl", "rb") as f:
    _, embedder = pickle.load(f)  # only need embedder


def detect_duplicates(reports, text_weight=0.6, location_weight=0.4, threshold=0.75):
    texts = [r["title"] + " " + r["description"] for r in reports]
    locations = np.array([[r["lat"], r["lng"]] for r in reports])

    print(f"Received {len(reports)} reports")

    # Encode text to embeddings
    embeddings = embedder.encode(texts)

    # Text similarity
    text_sim = cosine_similarity(embeddings)

    # Location similarity
    dists = cdist(locations, locations, metric="euclidean")
    max_dist = np.max(dists) or 1
    loc_sim = 1 - (dists / max_dist)

    # Combine
    combined_sim = text_weight * text_sim + location_weight * loc_sim

    # Find pairs above threshold
    duplicates = []
    n = len(reports)
    for i in range(n):
        for j in range(i + 1, n):
            if combined_sim[i, j] > threshold:
                duplicates.append({
                    "report1": reports[i]["id"],
                    "report2": reports[j]["id"],
                    "similarity": float(combined_sim[i, j])
                })

    print(f"Found {len(duplicates)} duplicate pairs")
    return duplicates
