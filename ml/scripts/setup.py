import nltk
import spacy
import sys
import os


def setup_nlp():
    try:
        nltk_path = os.path.join(os.path.expanduser("~"), "nltk_data")
        os.makedirs(nltk_path, exist_ok=True)
        nltk.data.path.append(nltk_path)

        nltk.download('wordnet', download_dir=nltk_path, quiet=True)
        nltk.download('averaged_perceptron_tagger',
                      download_dir=nltk_path, quiet=True)

        spacy.cli.download("en_core_web_sm")

        print("NLP setup completed successfully")
    except Exception as e:
        print(f"NLP setup failed: {str(e)}", file=sys.stderr)
        raise


if __name__ == "__main__":
    setup_nlp()
