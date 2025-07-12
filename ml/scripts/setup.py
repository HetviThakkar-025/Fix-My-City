# setup.py
import nltk
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

import spacy
spacy.cli.download('en_core_web_sm')
