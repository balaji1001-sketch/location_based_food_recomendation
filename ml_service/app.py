"""
ML Service Main Application
Flask API for ML-based recommendations and sentiment analysis
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from sentiment_analyzer import SentimentAnalyzer
from recommendation_engine import RecommendationEngine
import logging

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize analyzers
sentiment_analyzer = SentimentAnalyzer()
recommendation_engine = RecommendationEngine()


# ==================== Health Check ====================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'ML Service is running',
        'status': 'healthy'
    }), 200


# ==================== Sentiment Analysis Endpoints ====================

@app.route('/sentiment-analysis', methods=['POST'])
def analyze_sentiment():
    """
    Sentiment Analysis Endpoint
    
    POST /sentiment-analysis
    Body: { "text": "Review text here" }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'message': 'Text field is required'
            }), 400

        text = data['text']
        
        # Analyze sentiment
        result = sentiment_analyzer.analyze_sentiment(text)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as error:
        logger.error(f'Sentiment analysis error: {str(error)}')
        return jsonify({
            'success': False,
            'message': str(error)
        }), 500


@app.route('/batch-sentiment-analysis', methods=['POST'])
def batch_analyze_sentiment():
    """
    Batch Sentiment Analysis
    
    POST /batch-sentiment-analysis
    Body: { "texts": ["text1", "text2", ...] }
    """
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({
                'success': False,
                'message': 'Texts array is required'
            }), 400

        texts = data['texts']
        
        # Analyze each text
        results = [
            sentiment_analyzer.analyze_sentiment(text)
            for text in texts
        ]
        
        return jsonify({
            'success': True,
            'count': len(results),
            'data': results
        }), 200
        
    except Exception as error:
        logger.error(f'Batch sentiment analysis error: {str(error)}')
        return jsonify({
            'success': False,
            'message': str(error)
        }), 500


# ==================== Recommendation Endpoints ====================

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get Personalized Recommendations
    
    POST /recommendations
    Body: {
        "userId": "user_id",
        "userPreferences": { "cuisines": [...], "budgetRange": "..." },
        "ratedRestaurants": [...],
        "limit": 10
    }
    """
    try:
        data = request.get_json()
        
        user_id = data.get('userId')
        user_preferences = data.get('userPreferences', {})
        limit = data.get('limit', 10)
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID is required'
            }), 400

        # Get content-based recommendations (placeholder implementation)
        # In production, would fetch actual restaurant data from MongoDB
        recommendations = {
            'type': 'hybrid',
            'count': limit,
            'recommendations': [],  # Would be populated with restaurant IDs
            'method': 'content-based-collaborative-hybrid'
        }
        
        return jsonify({
            'success': True,
            'data': recommendations
        }), 200
        
    except Exception as error:
        logger.error(f'Recommendation error: {str(error)}')
        return jsonify({
            'success': False,
            'message': str(error)
        }), 500


# ==================== Error Handlers ====================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500


# ==================== Main ====================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('ENVIRONMENT') == 'development'
    
    print(f"""
╔════════════════════════════════════╗
║   ML Service Server                ║
║   ✅ Running on port {port}        ║
║   Mode: {'Development' if debug else 'Production'}    ║
╚════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
