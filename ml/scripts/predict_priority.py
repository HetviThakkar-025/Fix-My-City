import pickle
import pandas as pd
from preprocessing import preprocess_text_column
from feature_utils import count_high_words

with open("../models/priority_model.pkl", 'rb') as f:
    model, embedder = pickle.load(f)


def predict_priority(text):
    clean = preprocess_text_column(pd.Series([text]))[0]
    embedding = embedder.encode([clean])[0]
    num_high = count_high_words(text)
    import numpy as np
    vec = np.hstack([embedding, num_high])
    return model.predict([vec])[0]


if __name__ == "__main__":
    print("Predicted:", predict_priority("Dog poop in park"))
    print("Predicted:", predict_priority("Fire broke out in building"))
    print("Predicted:", predict_priority(
        "Multiple potholes causing accidents"))
    print("Predicted:", predict_priority("Sidewalk cracked near main road"))
    print("Predicted:", predict_priority(
        "Grass needs trimming in central park."))
    print('my db')
    print("Predicted:", predict_priority(
        "Seasonal flooding continue to disrupt daily life during the monsoon"))
    print("Predicted:", predict_priority(
        "There has been an overflowing garbage bin. It smells bad and people are throwing more waste around it."))
    print("Predicted:", predict_priority(
        "Street lights are not working on Sector 5 road, making the area unsafe at night."))
    print("Predicted:", predict_priority(
        "broken bench"))
