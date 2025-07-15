import pickle
import pandas as pd
import numpy as np
from preprocessing import preprocess_text_column
from feature_utils import count_high_words

with open("../models/priority_model.pkl", 'rb') as f:
    model, embedder = pickle.load(f)


def predict_priority(text):
    clean = preprocess_text_column(pd.Series([text]))[0]
    embedding = embedder.encode([clean])[0]
    num_high = count_high_words(text)
    vec = np.hstack([embedding, num_high])
    return model.predict([vec])[0]


if __name__ == "__main__":
    print("Predicted:", predict_priority("Someone spit on the wall"))
    print("Predicted:", predict_priority("Dog poop in park"))
    print("Predicted:", predict_priority("Fire broke out in building"))
