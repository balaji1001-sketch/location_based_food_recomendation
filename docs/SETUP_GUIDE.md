# Setup & Installation Guide

## Prerequisites

- **Node.js** v14+ (with npm)
- **Python** 3.8+
- **MongoDB** 4.4+
- **Redis** 6.0+
- **Git**

---

## Project Structure

```
project/
├── frontend/                 # React.js Web Application
├── backend/                  # Node.js + Express API
├── ml_service/              # Python ML Microservice
├── scraper/                 # Web Scraping Service
├── docs/                    # Documentation
└── README.md
```

---

## Installation Steps

### 1. Setup Backend (Node.js + Express)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/food-recommendation
# JWT_SECRET=your_secret_key
# PORT=5000

# Start backend server
npm start
# Or for development with auto-reload
npm run dev
```

**Backend will run on:** `http://localhost:5000`

---

### 2. Setup Frontend (React.js)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_MAPS_API_KEY=your_google_maps_key

# Start development server
npm start
```

**Frontend will run on:** `http://localhost:3000`

---

### 3. Setup ML Service (Python)

```bash
cd ml_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data (required for sentiment analysis)
python -m nltk.downloader vader_lexicon punkt wordnet

# Create .env file
cp .env.example .env

# Start ML service
python app.py
```

**ML Service will run on:** `http://localhost:5001`

---

### 4. Setup Web Scraper (Python)

```bash
cd scraper

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run scraper once
python main.py once Mumbai

# Or run with scheduler
python main.py schedule
```

---

### 5. Setup Databases

#### MongoDB

```bash
# Start MongoDB service
# On Windows:
mongod

# On Linux:
sudo service mongod start

# Or using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Redis

```bash
# Start Redis service
# On Windows (using WSL):
redis-server

# On Linux:
sudo service redis-server start

# Or using Docker:
docker run -d -p 6379:6379 --name redis redis:latest
```

---

## Running All Services

### Option 1: Manual (Separate Terminals)

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: ML Service
cd ml_service && source venv/bin/activate && python app.py

# Terminal 4: Scraper (Optional)
cd scraper && source venv/bin/activate && python main.py schedule
```

### Option 2: Using Docker Compose (Recommended)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: food-recommendation

  redis:
    image: redis:latest
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
      - redis
    environment:
      MONGODB_URI: mongodb://mongodb:27017/food-recommendation
      REDIS_URL: redis://redis:6379

  ml_service:
    build: ./ml_service
    ports:
      - "5001:5001"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

Run all services:
```bash
docker-compose up
```

---

## Configuration

### Backend Configuration (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-recommendation
JWT_SECRET=your_very_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
REDIS_URL=redis://localhost:6379
ML_SERVICE_URL=http://localhost:5001
LOG_LEVEL=debug
```

### Frontend Configuration (.env)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_ENVIRONMENT=development
```

### ML Service Configuration (.env)

```
PORT=5001
ENVIRONMENT=development
LOG_LEVEL=debug
FLASK_ENV=development
```

### Scraper Configuration (.env)

```
MONGODB_URI=mongodb://localhost:27017/food-recommendation
BACKEND_API_URL=http://localhost:5000
LOG_LEVEL=debug
SCRAPE_INTERVAL=3600
```

---

## Verification

### Check Backend
```bash
curl http://localhost:5000/api/health
# Response: {"success": true, "message": "Server is running"}
```

### Check Frontend
Open browser: `http://localhost:3000`

### Check ML Service
```bash
curl http://localhost:5001/health
# Response: {"success": true, "message": "ML Service is running"}
```

### Check Databases
```bash
# MongoDB
mongo
> db.serverStatus()

# Redis
redis-cli ping
# Response: PONG
```

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- Verify port 27017 is not blocked

### Redis Connection Error
- Ensure Redis is running: `redis-server`
- Check REDIS_URL in .env
- Verify port 6379 is not blocked

### Port Already in Use
```bash
# Find process using port (example: 5000)
# On Linux/Mac:
lsof -i :5000

# On Windows:
netstat -ano | findstr :5000

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

### Python Virtual Environment Issues
```bash
# Deactivate current environment
deactivate

# Remove and recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Development Workflow

1. **Start all services** (MongoDB, Redis, Backend, Frontend, ML Service)
2. **Create a feature branch** for your changes
3. **Make changes** to the relevant service
4. **Test your changes** using provided endpoints
5. **Commit and push** your changes
6. **Create a pull request** for review

---

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### ML Service Tests
```bash
cd ml_service
python -m pytest tests/
```

---

## Deployment

See individual README files in each service directory for deployment instructions.

- Frontend: `frontend/README.md`
- Backend: `backend/README.md`
- ML Service: `ml_service/README.md`
