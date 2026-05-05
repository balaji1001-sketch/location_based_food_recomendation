"""
Main Web Scraper Application
Orchestrates data scraping from multiple sources
"""

import os
import logging
import schedule
import time
from datetime import datetime
from dotenv import load_dotenv
from scraper import RestaurantScraper

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ScraperScheduler:
    """
    Manages scheduled scraping tasks
    """

    def __init__(self):
        """Initialize scraper scheduler"""
        self.scraper = RestaurantScraper()
        self.interval = int(os.getenv('SCRAPE_INTERVAL', 3600))  # 1 hour default
        self.locations = [
            'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 
            'Pune', 'Ahmedabad', 'Chennai', 'Kolkata'
        ]

    def scrape_all_locations(self):
        """Scrape restaurants from all locations"""
        logger.info('Starting scheduled scrape for all locations')
        
        try:
            for location in self.locations:
                self._scrape_location(location)
                time.sleep(2)  # Delay between locations
            
            logger.info('Completed scraping for all locations')
            
        except Exception as error:
            logger.error(f'Error in scheduled scrape: {str(error)}')

    def _scrape_location(self, location: str):
        """
        Scrape data for specific location
        
        Args:
            location (str): City/location name
        """
        try:
            logger.info(f'Scraping restaurants in {location}')
            
            # Scrape restaurants
            restaurants = self.scraper.scrape_restaurants(location)
            logger.info(f'Found {len(restaurants)} restaurants in {location}')
            
            # Process each restaurant
            for restaurant in restaurants:
                try:
                    # Add location metadata
                    restaurant['city'] = location
                    restaurant['scrapedAt'] = datetime.now().isoformat()
                    
                    # Send to backend
                    self.scraper.send_to_backend(
                        'api/restaurants',
                        [restaurant]
                    )
                    
                    time.sleep(0.5)  # Rate limiting
                    
                except Exception as error:
                    logger.error(f'Error processing restaurant: {str(error)}')
            
        except Exception as error:
            logger.error(f'Error scraping {location}: {str(error)}')

    def start(self):
        """Start the scheduler"""
        logger.info(f'Starting scraper scheduler (interval: {self.interval}s)')
        
        # Schedule the scraping job
        schedule.every(self.interval).seconds.do(self.scrape_all_locations)
        
        # Also run once on startup
        self.scrape_all_locations()
        
        # Keep scheduler running
        logger.info('Scraper scheduler is running. Press Ctrl+C to stop.')
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except KeyboardInterrupt:
            logger.info('Scraper scheduler stopped by user')


# ==================== CLI Commands ====================

def scrape_single_location(location: str):
    """Scrape a single location"""
    logger.info(f'Scraping single location: {location}')
    scraper = RestaurantScraper()
    
    restaurants = scraper.scrape_restaurants(location)
    logger.info(f'Scraped {len(restaurants)} restaurants from {location}')
    
    for restaurant in restaurants:
        restaurant['city'] = location
        restaurant['scrapedAt'] = datetime.now().isoformat()
    
    return restaurants


def scrape_with_options(location: str, cuisine: str = None, limit: int = 10):
    """Scrape with specific options"""
    logger.info(f'Scraping with options: location={location}, cuisine={cuisine}, limit={limit}')
    scraper = RestaurantScraper()
    
    restaurants = scraper.scrape_restaurants(location, cuisine)
    
    return restaurants[:limit]


# ==================== Main ====================

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == 'once':
            # Run scraper once
            location = sys.argv[2] if len(sys.argv) > 2 else 'Mumbai'
            scrape_single_location(location)
        
        elif sys.argv[1] == 'schedule':
            # Run with scheduler
            scheduler = ScraperScheduler()
            scheduler.start()
    
    else:
        # Default: run scheduler
        print("""
╔════════════════════════════════════╗
║   Web Scraper Service              ║
║   ✅ Starting scraper...          ║
║                                    ║
║   Usage:                           ║
║   python main.py once [location]   ║
║   python main.py schedule          ║
╚════════════════════════════════════╝
        """)
        
        scheduler = ScraperScheduler()
        scheduler.start()
