import pandas as pd
from preprocessing import preprocess_text_column
from feature_utils import count_high_words


def main():
    df = pd.read_csv("../data/processed/311_manual_labels_fixed.csv")
    df['description_clean'] = preprocess_text_column(df['description'])
    df['num_high_words'] = df['description'].apply(count_high_words)
    df.to_csv("../data/processed/311_clean_manual_features.csv", index=False)
    print("Dataset ready with extra features!")


if __name__ == "__main__":
    main()
