"""
Sentiment Analysis Service
Analyzes review text sentiment using VADER and TextBlob
"""

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import re


class SentimentAnalyzer:
    """
    Sentiment analysis using multiple methods for accuracy
    """

    def __init__(self):
        """Initialize sentiment analyzers"""
        self.vader_analyzer = SentimentIntensityAnalyzer()

    def analyze_sentiment(self, text):
        """
        Analyze sentiment of review text
        
        Args:
            text (str): Review text to analyze
            
        Returns:
            dict: Sentiment classification and score
        """
        if not text or not isinstance(text, str):
            return {
                'sentiment': 'neutral',
                'score': 0.0,
                'positive': 0.0,
                'negative': 0.0,
                'neutral': 0.0,
            }

        # Clean text
        cleaned_text = self._clean_text(text)

        # VADER sentiment analysis
        vader_scores = self.vader_analyzer.polarity_scores(cleaned_text)
        compound_score = vader_scores['compound']

        # TextBlob sentiment analysis
        blob = TextBlob(cleaned_text)
        polarity = blob.sentiment.polarity  # Range: -1 to 1

        # Combine scores
        combined_score = (compound_score + polarity) / 2

        # Classify sentiment
        if combined_score >= 0.05:
            sentiment = 'positive'
        elif combined_score <= -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'

        return {
            'sentiment': sentiment,
            'score': round(combined_score, 2),
            'positive': vader_scores['pos'],
            'negative': vader_scores['neg'],
            'neutral': vader_scores['neu'],
            'textblob_polarity': round(polarity, 2),
        }

    @staticmethod
    def _clean_text(text):
        """
        Clean text for analysis
        
        Args:
            text (str): Raw text
            
        Returns:
            str: Cleaned text
        """
        # Remove URLs
        text = re.sub(r'http\S+|www\S+', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Convert to lowercase
        text = text.lower()
        
        return text
