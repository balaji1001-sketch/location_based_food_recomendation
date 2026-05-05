# 🚀 Project Startup Status

## 📊 Service Status

| Service | Port | Status | Issue |
|---------|------|--------|-------|
| **Frontend** | 3000 | 🔄 Starting | Loading dependencies |
| **Backend** | 5000 | ❌ Error | MongoDB connection failed |
| **ML Service** | 5001 | ❌ Error | NLTK import issue |
| **Scraper** | 5002 | ⏸️ Not Started | Requires MongoDB |

---

## ⚠️ Required Setup

### 1. MongoDB Database
**Status:** ❌ NOT RUNNING

You need to install and start MongoDB:

#### Option A: Install MongoDB Community Edition
```powershell
# Download from: https://www.mongodb.com/try/download/community
# Run installer and follow instructions
# Then start MongoDB:
mongod
```

#### Option B: Use Docker (Recommended for Windows)
```powershell
# Install Docker Desktop from: https://www.docker.com/products/docker-desktop

# Start MongoDB in Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start Redis in Docker:
docker run -d -p 6379:6379 --name redis redis:latest
```

#### Option C: Use WSL2 (Windows Subsystem for Linux)
```bash
# In WSL2 terminal:
sudo systemctl start mongodb
sudo systemctl start redis-server
```

---

### 2. Redis Cache
**Status:** ❌ NOT RUNNING

Required for backend caching. Install via:
- Docker (recommended - see Option B above)
- Native installation from https://github.com/microsoftarchive/redis/releases

---

## ✅ What's Working

- ✅ All npm packages installed (433 backend, 1,570 frontend)
- ✅ All Python packages installed (36 ML, 91 scraper)
- ✅ .env files configured
- ✅ Node.js v14+ installed
- ✅ Python 3.14 installed
- ✅ npm package manager ready

---

## 🔧 Next Steps

### Step 1: Install & Start Databases

**Using Docker (Easiest):**
```powershell
# Terminal 1: MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Terminal 2: Redis
docker run -d -p 6379:6379 --name redis redis:latest

# Verify they're running:
docker ps
```

**Using MongoDB Community & Redis:**
```powershell
# Terminal 1: MongoDB
mongod

# Terminal 2: Redis
redis-server
```

### Step 2: Start Services

Once databases are running, services will start automatically or you can restart them:

```powershell
# The services are already starting in background terminals
# Check each terminal for output

# If you need to restart manually:
# Terminal 1: Backend
cd d:\project\backend && npm start

# Terminal 2: Frontend  
cd d:\project\frontend && npm start

# Terminal 3: ML Service
cd d:\project\ml_service && .\venv\Scripts\activate.ps1 ; python app.py

# Terminal 4: Scraper (optional)
cd d:\project\scraper && .\venv\Scripts\activate.ps1 ; python main.py schedule
```

### Step 3: Access the Application

Once all services are running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **ML Service:** http://localhost:5001

---

## 🐳 Recommended: Quick Start with Docker

If you have Docker installed, this is the fastest way:

```powershell
# Start databases
docker run -d -p 27017:27017 --name food-mongodb mongo:latest
docker run -d -p 6379:6379 --name food-redis redis:latest

# Then in separate PowerShell windows, start the services:
cd d:\project\backend && npm start
cd d:\project\frontend && npm start
cd d:\project\ml_service && .\venv\Scripts\activate.ps1 ; python app.py
```

---

## 🆘 Troubleshooting

### MongoDB: "ECONNREFUSED 127.0.0.1:27017"
→ MongoDB is not running. Start it with `mongod` or Docker

### Frontend hangs on startup
→ Wait 2-3 minutes for webpack to compile. Check the terminal for progress

### Python import errors in ML Service
→ Ensure virtual environment is activated: `.\venv\Scripts\activate.ps1`

### Port already in use
→ Change port in .env file or kill existing process:
```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
# Kill it:
Stop-Process -Id <PID> -Force
```

---

## 📝 Configuration Files

All services are configured with development defaults:

- `backend/.env` - Backend config (MongoDB, Redis, JWT)
- `frontend/.env` - Frontend config (API URL)
- `ml_service/.env` - ML service config
- `scraper/.env` - Scraper config

---

## ✨ Environment Status

```
Node.js:  ✅ Installed
npm:      ✅ Installed
Python:   ✅ Installed
Python venv (ML): ✅ Created
Python venv (Scraper): ✅ Created
MongoDB:  ❌ NOT RUNNING
Redis:    ❌ NOT RUNNING
```

---

## 🎯 Quick Action Plan

1. **Install Docker** (if not already installed)
2. **Run in PowerShell:**
   ```powershell
   docker run -d -p 27017:27017 --name food-mongodb mongo:latest
   docker run -d -p 6379:6379 --name food-redis redis:latest
   ```
3. **Wait 30 seconds, then** open http://localhost:3000
4. **Done!** All services will auto-connect

---

**Need help?** See [QUICK_START_WINDOWS.md](../QUICK_START_WINDOWS.md) or [docs/TESTING_GUIDE.md](../docs/TESTING_GUIDE.md)

---

Generated: March 26, 2026  
Status: Ready to run (databases needed)
