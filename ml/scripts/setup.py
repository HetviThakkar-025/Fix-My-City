import nltk
import spacy
import sys


def setup_nlp():
    try:
        nltk.download('wordnet', quiet=True)
        nltk.download('averaged_perceptron_tagger', quiet=True)
        spacy.cli.download('en_core_web_sm', quiet=True)
        print("NLP setup completed successfully")
    except Exception as e:
        print(f"NLP setup failed: {str(e)}", file=sys.stderr)
        raise


if __name__ == "__main__":
    setup_nlp()
