"""
Recommendation Engine
Implements content-based and collaborative filtering algorithms
"""

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import pandas as pd


class RecommendationEngine:
    """
    Provides restaurant recommendations using multiple algorithms
    """

    @staticmethod
    def content_based_recommendations(user_preferences, restaurants, top_n=10):
        """
        Content-based filtering using cosine similarity
        Recommends restaurants similar to user preferences
        
        Args:
            user_preferences (dict): User's cuisine, price, rating preferences
            restaurants (list): List of restaurant data
            top_n (int): Number of recommendations to return
            
        Returns:
            list: Recommended restaurant IDs
        """
        if not restaurants or not user_preferences:
            return []

        # Create feature vectors
        features = []
        restaurant_ids = []

        for restaurant in restaurants:
            feature_vector = RecommendationEngine._create_feature_vector(
                restaurant, user_preferences
            )
            features.append(feature_vector)
            restaurant_ids.append(restaurant.get('_id'))

        if len(features) < 2:
            return restaurant_ids

        # Normalize features
        scaler = StandardScaler()
        features_normalized = scaler.fit_transform(features)

        # Create user preference vector
        user_vector = RecommendationEngine._create_user_vector(user_preferences)

        # Compute cosine similarity
        similarities = cosine_similarity([user_vector], features_normalized)[0]

        # Get top N recommendations
        top_indices = np.argsort(similarities)[::-1][:top_n]
        recommendations = [restaurant_ids[i] for i in top_indices]

        return recommendations

    @staticmethod
    def collaborative_filtering_recommendations(user_id, ratings_matrix, top_n=10):
        """
        Collaborative filtering using user-user similarity
        Recommends restaurants based on similar users' ratings
        
        Args:
            user_id (str): Current user ID
            ratings_matrix (DataFrame): User-restaurant ratings matrix
            top_n (int): Number of recommendations to return
            
        Returns:
            list: Recommended restaurant IDs
        """
        if ratings_matrix.empty:
            return []

        # Compute user-user similarity
        user_similarity = cosine_similarity(ratings_matrix)

        # Find similar users
        user_idx = list(ratings_matrix.index).index(user_id) if user_id in ratings_matrix.index else 0
        similar_users = np.argsort(user_similarity[user_idx])[::-1][1:11]  # Top 10 similar users

        # Get recommendations from similar users
        recommendations = {}
        for similar_user_idx in similar_users:
            similar_user = ratings_matrix.index[similar_user_idx]
            similar_user_ratings = ratings_matrix.loc[similar_user]

            # Get restaurants not rated by current user
            for restaurant, rating in similar_user_ratings.items():
                if pd.isna(ratings_matrix.loc[user_id, restaurant]):
                    if restaurant not in recommendations:
                        recommendations[restaurant] = []
                    recommendations[restaurant].append(rating)

        # Score recommendations by average rating from similar users
        scored_recommendations = {
            restaurant: np.mean(ratings)
            for restaurant, ratings in recommendations.items()
        }

        # Return top N
        top_restaurants = sorted(
            scored_recommendations.items(),
            key=lambda x: x[1],
            reverse=True
        )[:top_n]

        return [restaurant for restaurant, _ in top_restaurants]

    @staticmethod
    def hybrid_recommendations(user_preferences, user_id, restaurants, 
                             ratings_matrix, top_n=10, weights=None):
        """
        Hybrid approach combining content-based and collaborative filtering
        
        Args:
            user_preferences (dict): User preferences
            user_id (str): User ID
            restaurants (list): Restaurant list
            ratings_matrix (DataFrame): Ratings matrix
            top_n (int): Number of recommendations
            weights (dict): Weights for each algorithm
            
        Returns:
            list: Recommended restaurant IDs
        """
        if weights is None:
            weights = {'content': 0.6, 'collaborative': 0.4}

        # Get recommendations from both methods
        content_recs = RecommendationEngine.content_based_recommendations(
            user_preferences, restaurants, top_n * 2
        )
        collab_recs = RecommendationEngine.collaborative_filtering_recommendations(
            user_id, ratings_matrix, top_n * 2
        )

        # Score recommendations
        scores = {}
        for i, rec in enumerate(content_recs):
            scores[rec] = scores.get(rec, 0) + weights['content'] * (1 - i / (top_n * 2))

        for i, rec in enumerate(collab_recs):
            scores[rec] = scores.get(rec, 0) + weights['collaborative'] * (1 - i / (top_n * 2))

        # Return top N
        top_recs = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
        return [rec for rec, _ in top_recs]

    @staticmethod
    def _create_feature_vector(restaurant, user_preferences):
        """Create feature vector for a restaurant"""
        features = []

        # Price feature (normalized)
        avg_price = restaurant.get('avgPrice', 0)
        features.append(avg_price / 1000)  # Normalize to 0-1 range

        # Rating feature
        rating = restaurant.get('rating', 0)
        features.append(rating / 5)

        # Cuisine matching (one-hot encoding for top cuisines)
        user_cuisines = set(user_preferences.get('cuisines', []))
        restaurant_cuisines = set(restaurant.get('cuisines', []))
        cuisine_match = len(user_cuisines.intersection(restaurant_cuisines)) / max(
            len(user_cuisines), 1
        )
        features.append(cuisine_match)

        # Budget range matching
        budget_range = user_preferences.get('budgetRange', 'medium')
        if budget_range == 'low' and avg_price < 300:
            features.append(1.0)
        elif budget_range == 'medium' and 300 <= avg_price <= 700:
            features.append(1.0)
        elif budget_range == 'high' and avg_price > 700:
            features.append(1.0)
        else:
            features.append(0.0)

        return features

    @staticmethod
    def _create_user_vector(user_preferences):
        """Create feature vector from user preferences"""
        vector = [
            0.0,  # Placeholder for price (would be set based on budget)
            4.0 / 5,  # Preference for high ratings (normalized)
            1.0,  # Preference match for cuisines
            1.0,  # Budget match preference
        ]
        return vector
