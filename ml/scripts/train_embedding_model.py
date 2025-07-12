import pandas as pd
import pickle
from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score


def main():
    print("Loading dataset...")
    df = pd.read_csv("../data/processed/311_clean_manual_features.csv")
    print(df['priority_label'].value_counts())

    print("Loading embeddings...")
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = embedder.encode(df['description_clean'])

    # Combine embeddings + extra feature
    import numpy as np
    extra = df['num_high_words'].values.reshape(-1, 1)
    X = np.hstack([embeddings, extra])
    y = df['priority_label']

    print("Training...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, stratify=y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    print("Evaluating...")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    print("Accuracy:", accuracy_score(y_test, y_pred))

    # Save
    with open("../models/priority_model.pkl", 'wb') as f:
        pickle.dump((model, embedder), f)
    print("Saved model and embedder!")


if __name__ == "__main__":
    main()
