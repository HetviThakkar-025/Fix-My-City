from transformers import pipeline

# Load summarization model once (can use a smaller model for speed)
print("Loading summarization model...")
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
print("Summarization model loaded!")


def generate_summary(texts, max_len=60, min_len=15):
    """
    Generate summaries for a list of text descriptions.
    :param texts: list of strings
    :return: list of summaries
    """
    summaries = []
    for t in texts:
        try:
            result = summarizer(t, max_length=max_len,
                                min_length=min_len, do_sample=False)
            summaries.append(result[0]['summary_text'])
        except Exception as e:
            print(f"Error summarizing: {e}")
            summaries.append(t)  # fallback to original text
    return summaries
