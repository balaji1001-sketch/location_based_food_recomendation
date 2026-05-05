# Machine Learning Documentation

## Overview
The ML service provides recommendation algorithms and sentiment analysis using Python with scikit-learn and NLP libraries.

---

## Sentiment Analysis

### Algorithm
Combines VADER (Valence Aware Dictionary and sEntiment Reasoner) and TextBlob for robust sentiment detection.

**Features:**
- Handles sarcasm and context
- Provides confidence scores
- Classifies as positive, negative, or neutral

### Usage

#### Python API
```python
from sentiment_analyzer import SentimentAnalyzer

analyzer = SentimentAnalyzer()

result = analyzer.analyze_sentiment("Great food and amazing service!")
# Output:
# {
#   'sentiment': 'positive',
#   'score': 0.85,
#   'positive': 0.75,
#   'negative': 0.0,
#   'neutral': 0.25,
#   'textblob_polarity': 0.8
# }
```

#### REST API
```bash
curl -X POST http://localhost:5001/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{"text": "Great food and amazing service!"}'
```

---

## Recommendation Algorithms

### 1. Content-Based Filtering

**How it works:**
- Creates feature vectors for restaurants based on:
  - Average price
  - Rating
  - Cuisine types
  - Budget range match
- Computes cosine similarity between user preferences and restaurants
- Recommends most similar restaurants

**Advantages:**
- No cold-start problem
- Personalized based on explicit preferences
- Works well for new users

**Example:**
```python
from recommendation_engine import RecommendationEngine

user_preferences = {
  'cuisines': ['North Indian', 'Chinese'],
  'budgetRange': 'medium',
  'rating': 4.0
}

restaurants = [
  {
    '_id': '123',
    'name': 'Taj Express',
    'cuisines': ['North Indian'],
    'avgPrice': 350,
    'rating': 4.5
  },
  # ... more restaurants
]

recommendations = RecommendationEngine.content_based_recommendations(
  user_preferences, 
  restaurants, 
  top_n=10
)
```

---

### 2. Collaborative Filtering

**How it works:**
- Builds user-restaurant ratings matrix
- Computes user-user similarity based on rating patterns
- Finds similar users and recommends restaurants they liked
- Uses cosine similarity for user similarity

**Advantages:**
- Discovers unexpected recommendations
- Learns from crowd behavior
- Works well for large user bases

**Limitations:**
- Requires sufficient user data
- Cold-start problem for new users
- Sparsity issues

**Example:**
```python
import pandas as pd

ratings_matrix = pd.DataFrame({
  'restaurant_1': [5, 4, 3, 2],
  'restaurant_2': [4, 5, 2, 3],
  'restaurant_3': [1, 2, 5, 4]
}, index=['user_1', 'user_2', 'user_3', 'user_4'])

recommendations = RecommendationEngine.collaborative_filtering_recommendations(
  'user_1',
  ratings_matrix,
  top_n=5
)
```

---

### 3. Hybrid Approach

**How it works:**
- Combines content-based and collaborative filtering
- Weights both approaches
- Provides balanced recommendations

**Weights (default):**
- Content-based: 60%
- Collaborative: 40%

**Code:**
```python
recommendations = RecommendationEngine.hybrid_recommendations(
  user_preferences=preferences,
  user_id='user_id',
  restaurants=restaurants,
  ratings_matrix=ratings_matrix,
  top_n=10,
  weights={'content': 0.6, 'collaborative': 0.4}
)
```

---

## Feature Vectors

### Restaurant Features
```
[price_normalized, rating_normalized, cuisine_match, budget_match]
```

**Example:**
- Price: 350 → 0.35 (normalized to 0-1)
- Rating: 4.5 → 0.9 (0-5 scale to 0-1)
- Cuisine match: 1.0 (user likes all cuisines)
- Budget match: 1.0 (within budget range)

### Distance Metric
Cosine Similarity:
```
similarity = cos(θ) = (A · B) / (||A|| * ||B||)
```

---

## API Endpoints

### Sentiment Analysis
```
POST /sentiment-analysis
Content-Type: application/json

{
  "text": "Review text here"
}

Response:
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "score": 0.85,
    "positive": 0.75,
    "negative": 0.0,
    "neutral": 0.25
  }
}
```

### Batch Sentiment Analysis
```
POST /batch-sentiment-analysis

{
  "texts": ["text1", "text2", ...]
}
```

### Recommendations
```
POST /recommendations

{
  "userId": "user_id",
  "userPreferences": {
    "cuisines": ["North Indian"],
    "budgetRange": "medium"
  },
  "ratedRestaurants": [...],
  "limit": 10
}
```

---

## Model Training & Evaluation

### Evaluation Metrics

1. **Precision@K**: Proportion of top-K recommendations that are relevant
2. **Recall@K**: Proportion of all relevant items in top-K recommendations
3. **NDCG (Normalized Discounted Cumulative Gain)**: Ranking quality metric
4. **MAP (Mean Average Precision)**: Overall recommendation quality

### Cross-Validation
Using K-fold cross-validation (k=5) to evaluate:
- Recommendation accuracy
- Ranking quality
- User satisfaction

---

## Optimization Tips

1. **Caching**: Cache frequently computed similarities
2. **Batching**: Process recommendations in batches
3. **Dimension Reduction**: Use PCA for high-dimensional data
4. **Similarity Threshold**: Filter low-similarity recommendations
5. **Diversity**: Add diversity to avoid echo chamber effect

---

## Troubleshooting

### Issue: Cold Start Problem
**Solution:**
- Use content-based filtering for new users
- Recommend popular restaurants initially
- Request user preferences upfront

### Issue: Sparsity in Ratings
**Solution:**
- Use matrix factorization (SVD)
- Implement item-based CF
- Combine with content-based filtering

### Issue: Slow Recommendations
**Solution:**
- Cache similarity matrices
- Use approximate nearest neighbors (ANN)
- Reduce feature dimensions
- Implement incremental learning
