# preprocessing.py
import re
import string
import spacy
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from nltk.corpus import wordnet

# Don't load SpaCy model at startup
nlp = None
lemmatizer = WordNetLemmatizer()


def get_nlp():
    """Load the SpaCy model only when needed."""
    global nlp
    if nlp is None:
        nlp = spacy.load('en_core_web_sm')
    return nlp


def remove_punc(text):
    return text.translate(str.maketrans('', '', string.punctuation))


def remove_emoji(text):
    pattern = re.compile("["
                         u"\U0001F600-\U0001F64F"
                         u"\U0001F300-\U0001F5FF"
                         u"\U0001F680-\U0001F6FF"
                         u"\U0001F1E0-\U0001F1FF"
                         u"\U00002700-\U000027BF"
                         u"\U0001F900-\U0001F9FF"
                         u"\U0001FA70-\U0001FAFF"
                         u"\U00002600-\U000026FF"
                         u"\U0001F000-\U0001F02F"
                         "]+", flags=re.UNICODE)
    return pattern.sub(r'', text)


def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN


def lemmatize_text(text):
    nlp_model = get_nlp()  # Load model here
    words = [str(token) for token in nlp_model(text)]
    tagged = pos_tag(words)
    return [lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in tagged]


def preprocess_text_column(text_series):
    return (text_series.str.lower()
            .apply(remove_punc)
            .apply(remove_emoji)
            .apply(lemmatize_text)
            .apply(lambda x: ' '.join(x)))
