# ml/scripts/predict_toxicity.py
from transformers import pipeline
import numpy as np
from typing import List, Dict


class ToxicityDetector:
    def __init__(self):
        print("Loading toxicity model...")
        self.model = pipeline(
            "text-classification",
            model="unitary/toxic-bert",
            return_all_scores=True
        )
        print("Toxicity model loaded!")

    def predict_toxicity(self, texts: List[str]) -> List[Dict]:
        """
        Predict toxicity for a list of texts
        Returns: List of dicts with toxicity scores for each category
        """
        results = []
        for text in texts:
            try:
                prediction = self.model(text)[0]
                scores = {item['label']: item['score'] for item in prediction}
                results.append({
                    'text': text,
                    'scores': scores,
                    'is_toxic': any(score > 0.9 for label, score in scores.items()
                                    if label != 'neutral')
                })
            except Exception as e:
                print(f"Error processing text: {e}")
                results.append({
                    'text': text,
                    'scores': {},
                    'is_toxic': False,
                    'error': str(e)
                })
        return results


# Singleton instance
toxicity_detector = ToxicityDetector()
